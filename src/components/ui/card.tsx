
export const Card = ({ children, className }: any) => {
  return (
    <div className={`rounded-xl border p-4 bg-white shadow ${className || ""}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children }: any) => {
  return <div className="mt-2">{children}</div>;
};
