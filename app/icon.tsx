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
          background: "#111826",
          color: "#F7F7F5",
          fontSize: 22,
          fontWeight: 700,
          fontFamily: "serif",
          borderRadius: 7,
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
