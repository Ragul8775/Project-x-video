export { Loader };

interface LoaderProps {
  color?: string;
  duration?: number;
  loading?: boolean;
  className?: string;
}

const Loader = ({
  color = "white",
  duration = 5,
  loading = true,
  className = "",
}: LoaderProps) => {
  return (
    <div
      className={`h-full relative flex items-center justify-center ${className} w-fit`}
    >
      <div className="leapfrog">
        <div className="leapfrog_dot"></div>
        <div className="leapfrog_dot"></div>
        <div className="leapfrog_dot"></div>
      </div>
    </div>
  );
};

export default Loader;
