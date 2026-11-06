import Image from "next/image";
export function Mark({ size = 30 }: { size?: number }) {
  return (
    <Image
      src="/mark.svg"
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
    />
  );
}
export function Arrow() {
  return <span aria-hidden="true">↗</span>;
}
