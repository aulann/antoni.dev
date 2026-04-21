import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f0e6d3",
          borderRadius: 7,
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 256 256"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="24" y="56" width="208" height="144" rx="16" fill="none" stroke="#0d0d0d" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="24" y1="104" x2="232" y2="104" stroke="#0d0d0d" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="60,140 92,168 60,196" fill="none" stroke="#0d0d0d" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="100" y1="196" x2="156" y2="196" stroke="#0d0d0d" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    ),
    { ...size },
  );
}
