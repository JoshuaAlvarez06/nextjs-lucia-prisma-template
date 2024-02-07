export function Logo({
  color = "#000000",
  width = "10px",
}: {
  color?: string;
  width?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      version="1.1"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      xmlSpace="preserve"
      width={width}
      fill={color}
    >
      <path d="M35.27,75.27c4.47,0,8.7-1.17,12.34-3.22c3.99-2.23,7.32-5.56,9.6-9.52c2.13-3.7,3.33-7.98,3.33-12.53  c0-4.55-1.2-8.83-3.33-12.53c-2.53,1.49-4.55,3.72-5.77,6.41c0.72,1.89,1.12,3.96,1.12,6.12s-0.4,4.2-1.12,6.09  c-1.7,4.47-5.19,8.09-9.6,9.9c-2.02,0.85-4.26,1.3-6.57,1.3c-9.55,0-17.29-7.77-17.29-17.29c0-9.55,7.74-17.29,17.29-17.29  c2.31,0,4.55,0.45,6.57,1.3c1.6-2.29,3.54-4.36,5.77-6.07c-3.64-2.05-7.88-3.22-12.34-3.22C21.33,24.73,10,36.06,10,50  C10,63.94,21.33,75.27,35.27,75.27z"></path>
      <path d="M64.73,24.73c-5.35,0-10.32,1.68-14.39,4.52l-1.09,0.82c-0.45,0.35-0.9,0.72-1.36,1.09c-0.43,0.37-0.8,0.74-1.17,1.12  c-0.21,0.21-0.4,0.43-0.59,0.64c-0.37,0.4-0.72,0.8-1.04,1.2c-0.37,0.45-0.72,0.93-1.06,1.41c-0.11,0.16-0.21,0.29-0.29,0.43  c-2.71,4.02-4.28,8.86-4.28,14.05c0,4.55,1.22,8.83,3.33,12.53c2.53-1.49,4.52-3.75,5.77-6.44c-0.72-1.89-1.12-3.94-1.12-6.09  c0-2.18,0.4-4.26,1.14-6.17c0.03-0.08,0.05-0.13,0.08-0.21c0.11-0.29,0.21-0.56,0.37-0.82c0.35-0.8,0.77-1.57,1.25-2.29  c0.21-0.37,0.48-0.72,0.77-1.06c0.24-0.35,0.51-0.67,0.82-0.98c1.38-1.57,3.06-2.87,4.95-3.83c0.45-0.24,0.93-0.45,1.44-0.67  c2-0.8,4.18-1.25,6.46-1.25c9.52,0,17.29,7.74,17.29,17.29c0,9.52-7.77,17.29-17.29,17.29c-2.31,0-4.55-0.45-6.57-1.3  c-1.6,2.31-3.56,4.36-5.77,6.07c3.64,2.05,7.85,3.22,12.34,3.22C78.67,75.27,90,63.94,90,50C90,36.06,78.67,24.73,64.73,24.73z"></path>
    </svg>
  );
}
