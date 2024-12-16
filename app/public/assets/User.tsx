export default function User({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      viewBox="0 0 16 16"
      className={`${className ?? ""}`}
    >
      <g fill="currentColor" clipPath="url(#clip0_921_668)">
        <path d="M8 8c1.104 0 2.047-.39 2.828-1.172A3.854 3.854 0 0012 4c0-1.104-.39-2.047-1.172-2.828A3.855 3.855 0 008 0C6.896 0 5.953.39 5.172 1.172A3.854 3.854 0 004 4c0 1.104.39 2.047 1.172 2.828C5.953 7.61 6.896 8 8 8z"></path>
        <path d="M15.297 12.225a10.67 10.67 0 00-.146-1.136 8.815 8.815 0 00-.276-1.13 5.358 5.358 0 00-.448-1.016 3.66 3.66 0 00-.646-.843 2.72 2.72 0 00-.89-.558 3.132 3.132 0 00-1.162-.208c-.063 0-.208.075-.438.224-.229.15-.487.316-.776.5-.288.184-.663.35-1.125.5-.461.15-.925.224-1.39.224-.466 0-.93-.075-1.39-.224-.463-.15-.838-.316-1.126-.5-.288-.184-.547-.35-.776-.5-.23-.15-.375-.224-.437-.224-.424 0-.811.07-1.162.208-.35.14-.647.325-.89.558a3.663 3.663 0 00-.646.843 5.37 5.37 0 00-.448 1.016 8.832 8.832 0 00-.276 1.13 10.6 10.6 0 00-.146 1.136c-.024.35-.036.71-.036 1.078 0 .833.253 1.491.76 1.974.507.482 1.18.724 2.02.724h9.105c.84 0 1.514-.242 2.021-.724.507-.483.76-1.14.76-1.974 0-.368-.011-.728-.036-1.078z"></path>
      </g>
      <defs>
        <clipPath id="clip0_921_668">
          <path fill="#fff" d="M0 0H16V16H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
}
