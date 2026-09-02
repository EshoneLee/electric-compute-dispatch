import "./globals.css";

export const metadata = {
  title: "跨区域电算协同调度平台",
  description: "跨区域电算协同调度平台可视化原型"
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

