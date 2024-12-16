import React, { useEffect, useRef } from "react";

let tvScriptLoadingPromise: Promise<void> | undefined;

function getCurrentTimezoneName() {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timeZone;
}

// const TradingViewWidget: React.FC = () => {
//   const widgetRef = useRef<any>(null); // This will persist between renders

//   // Ensure that TradingView script is loaded only once
//   useEffect(() => {
//     if (!tvScriptLoadingPromise) {
//       tvScriptLoadingPromise = new Promise((resolve) => {
//         const script = document.createElement("script");
//         script.id = "tradingview-widget-loading-script";
//         script.src = "https://s3.tradingview.com/tv.js";
//         script.type = "text/javascript";
//         script.onload = () => resolve();
//         document.head.appendChild(script);
//       });
//     }
//   }, []);

//   // Initialize the TradingView widget, but only when necessary
//   useEffect(() => {
//     const createWidget = () => {
//       if (document.getElementById("tradingview") && "TradingView" in window) {
//         // // Only remove the existing widget if it exists
//         // if (widgetRef.current) {
//         //   widgetRef.current.remove();
//         //   widgetRef.current = null;
//         // }

//         widgetRef.current = new (window as any).TradingView.widget({
//           container_id: "tradingview",
//           autosize: true,
//           symbol: `PYTH:${"BTCUSD"}`,
//           interval: "1",
//           timezone: getCurrentTimezoneName(),
//           theme: "dark",
//           style: "1",
//           locale: "en",
//           toolbar_bg: "#f1f3f6",
//           enable_publishing: false,
//           allow_symbol_change: true,
//           supports_marks: true,
//           hide_side_toolbar: false,
//           details: false,
//         });
//       }
//     };

//     // Load the script and initialize the widget once
//     if (tvScriptLoadingPromise) {
//       tvScriptLoadingPromise.then(() => createWidget());
//     }

//     // Clean up the widget if the component is unmounted
//     return () => {
//       if (widgetRef.current && typeof widgetRef.current.remove === "function") {
//         try {
//           widgetRef.current.remove();
//         } catch (error) {
//           console.error("Error removing widget:", error);
//         }
//       }
//       widgetRef.current = null;
//     };
//   }, []); // Only re-create the widget when `selectedToken` or `positions` change

//   // Update marks when `positions` changes

//   return <div id="tradingview" className="w-full h-full" />;
// };

const TradingViewWidget = ({ token }: { token: string }) => {
  return (
    <iframe
      width="100%"
      height="600"
      src={`https://birdeye.so/tv-widget/${token}?chain=solana&viewMode=pair&chartInterval=15&chartType=Candle&chartTimezone=Asia%2FCalcutta&chartLeftToolbar=show&theme=dark`}
      // frameborder="0"
      //@ts-ignore
      allowfullscreen
    ></iframe>
  );
};

export default TradingViewWidget;
