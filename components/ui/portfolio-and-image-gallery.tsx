'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import React, {
  forwardRef,
  HTMLAttributes,
  ReactNode,
  Ref,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function useMergeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => {
    if (refs.every((ref) => ref == null)) return null;
    return (node: T) => {
      refs.forEach((ref) => {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref != null) {
          (ref as React.MutableRefObject<T | null>).current = node;
        }
      });
    };
  }, refs);
}

function useResponsiveValue(baseValue: number, mobileValue: number) {
  // Always initialize with baseValue — matches SSR output, no hydration mismatch.
  // useEffect updates after hydration if needed.
  const [value, setValue] = useState(baseValue);

  useEffect(() => {
    const handleResize = () => {
      setValue(window.innerWidth < 768 ? mobileValue : baseValue);
    };

    handleResize();

    let timeoutId: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, [baseValue, mobileValue]);

  return value;
}

export interface RadialScrollGalleryProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: (hoveredIndex: number | null) => ReactNode[];
  scrollDuration?: number;
  visiblePercentage?: number;
  baseRadius?: number;
  mobileRadius?: number;
  startTrigger?: string;
  onItemSelect?: (index: number) => void;
  direction?: 'ltr' | 'rtl';
  disabled?: boolean;
  maxRotation?: number;
}

export const RadialScrollGallery = forwardRef<
  HTMLDivElement,
  RadialScrollGalleryProps
>(
  (
    {
      children,
      scrollDuration = 2500,
      visiblePercentage = 45,
      baseRadius = 550,
      mobileRadius = 220,
      className = '',
      startTrigger = 'center center',
      onItemSelect,
      direction = 'ltr',
      disabled = false,
      maxRotation = 360,
      ...rest
    },
    ref
  ) => {
    const pinRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLUListElement>(null);
    const childRef = useRef<HTMLLIElement>(null);

    const mergedRef = useMergeRefs(ref, pinRef);

    const [manualHoverIndex, setManualHoverIndex] = useState<number | null>(null);
    const [autoHoverIndex, setAutoHoverIndex] = useState<number | null>(null);
    const hoveredIndex = manualHoverIndex ?? autoHoverIndex;

    const [childSize, setChildSize] = useState<{ w: number; h: number } | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const currentRadius = useResponsiveValue(baseRadius, mobileRadius);
    const circleDiameter = currentRadius * 2;

    const { visibleDecimal, hiddenDecimal } = useMemo(() => {
      const clamped = Math.max(10, Math.min(100, visiblePercentage));
      const v = clamped / 100;
      return { visibleDecimal: v, hiddenDecimal: 1 - v };
    }, [visiblePercentage]);

    const childrenNodes = useMemo(
      () => React.Children.toArray(children(hoveredIndex)),
      [children, hoveredIndex]
    );
    const childrenCount = childrenNodes.length;

    const childrenCountRef = useRef(childrenCount);
    useEffect(() => {
      childrenCountRef.current = childrenCount;
    }, [childrenCount]);

    useEffect(() => {
      setIsMounted(true);
      if (!childRef.current) return;

      let rafId: number;
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setChildSize({ w: entry.contentRect.width, h: entry.contentRect.height });
        }
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => ScrollTrigger.refresh());
      });

      observer.observe(childRef.current);
      return () => {
        observer.disconnect();
        cancelAnimationFrame(rafId);
      };
    }, [childrenCount]);

    useGSAP(
      () => {
        if (!pinRef.current || !containerRef.current || childrenCount === 0) return;

        const prefersReducedMotion = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches;

        if (prefersReducedMotion) return;

        gsap.fromTo(
          containerRef.current.children,
          { scale: 0, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 1.2,
            ease: 'back.out(1.2)',
            stagger: 0.05,
            scrollTrigger: {
              trigger: pinRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.to(containerRef.current, {
          rotation: maxRotation,
          ease: 'none',
          scrollTrigger: {
            trigger: pinRef.current,
            pin: true,
            start: startTrigger,
            end: `+=${scrollDuration}`,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const count = childrenCountRef.current;
              const R = self.progress * maxRotation;
              const topAngle = ((270 - R) % 360 + 360) % 360;
              const nearest = Math.round((topAngle / 360) * count) % count;
              setAutoHoverIndex(nearest);
            },
            onLeave: () => setAutoHoverIndex(null),
            onLeaveBack: () => setAutoHoverIndex(null),
          },
        });

        // Counter-rotate inner wrappers so cards stay upright.
        // Targeting a nested div — React writes transform only on <li> (positioning),
        // GSAP writes rotation only on this inner div → no conflict on re-renders.
        const counterEls = containerRef.current.querySelectorAll('.gsap-counter-rotate');
        gsap.to(counterEls, {
          rotation: -maxRotation,
          ease: 'none',
          transformOrigin: 'center center',
          scrollTrigger: {
            trigger: pinRef.current,
            start: startTrigger,
            end: `+=${scrollDuration}`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      },
      {
        scope: pinRef,
        dependencies: [scrollDuration, currentRadius, startTrigger, childrenCount, maxRotation],
      }
    );

    if (childrenCount === 0) return null;

    const scaleFactor = 1.25;
    const calculatedBuffer = childSize ? childSize.h * scaleFactor - childSize.h + 60 : 150;
    const visibleAreaHeight = childSize
      ? circleDiameter * visibleDecimal + childSize.h / 2 + calculatedBuffer
      : circleDiameter * visibleDecimal + 200;

    return (
      <div
        ref={mergedRef}
        className={`min-h-screen w-full relative flex items-center justify-center ${className}`}
        {...rest}
      >
        <div
          className='relative w-full overflow-hidden'
          style={{
            height: `${visibleAreaHeight}px`,
            maskImage: 'linear-gradient(to top, transparent 0%, black 40%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 40%, black 100%)',
          }}
        >
          <ul
            ref={containerRef}
            className={`
              absolute left-1/2 -translate-x-1/2 will-change-transform m-0 p-0 list-none
              transition-opacity duration-500 ease-out
              ${disabled ? 'opacity-50 pointer-events-none grayscale' : ''}
              ${isMounted ? 'opacity-100' : 'opacity-0'}
            `}
            dir={direction}
            style={{
              width: circleDiameter,
              height: circleDiameter,
              bottom: -(circleDiameter * hiddenDecimal),
            }}
          >
            {childrenNodes.map((child, index) => {
              const angle = (index / childrenCount) * 2 * Math.PI;
              let x = currentRadius * Math.cos(angle);
              const y = currentRadius * Math.sin(angle);

              if (direction === 'rtl') x = -x;

              const isHovered = hoveredIndex === index;
              const isAnyHovered = hoveredIndex !== null;

              return (
                // React owns transform (positioning). No rotation here — rotation
                // is on the inner .gsap-counter-rotate div so GSAP doesn't conflict.
                <li
                  key={index}
                  ref={index === 0 ? childRef : null}
                  className='absolute top-1/2 left-1/2'
                  style={{
                    zIndex: isHovered ? 100 : 10,
                    transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, 0)`,
                  }}
                >
                  {/* GSAP animates rotation on this div only */}
                  <div className='gsap-counter-rotate'>
                    <div
                      role='button'
                      tabIndex={disabled ? -1 : 0}
                      onClick={() => !disabled && onItemSelect?.(index)}
                      onKeyDown={(e) => {
                        if (disabled) return;
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onItemSelect?.(index);
                        }
                      }}
                      onPointerEnter={() => !disabled && setManualHoverIndex(index)}
                      onPointerLeave={() => !disabled && setManualHoverIndex(null)}
                      onFocus={() => !disabled && setManualHoverIndex(index)}
                      onBlur={() => !disabled && setManualHoverIndex(null)}
                      className={`
                        block cursor-pointer outline-none text-left
                        focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                        rounded-xl transition-all duration-500 ease-out will-change-transform
                        ${isHovered ? 'scale-110' : 'scale-100'}
                        ${isAnyHovered && !isHovered ? 'blur-[2px] opacity-40 grayscale' : 'blur-0 opacity-100'}
                      `}
                    >
                      {child}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
);

RadialScrollGallery.displayName = 'RadialScrollGallery';
