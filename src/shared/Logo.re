module Styles = {
  open Css;
  let logo = style([display(block)]);
};

let logo =
  <svg className=Styles.logo width="36px" height="36px" viewBox="0 0 36 36">
    <defs>
      <linearGradient
        x1="50%"
        y1="0%"
        x2="50%"
        y2="127.223881%"
        id="PutainDeCodeLogoGradient">
        <stop stopColor="#E41D57" offset="0%" />
        <stop stopColor="#C60000" offset="100%" />
      </linearGradient>
    </defs>
    <circle
      stroke="#FFFFFF"
      strokeWidth="2"
      fill="url(#PutainDeCodeLogoGradient)"
      cx="18"
      cy="18"
      r="17"
    />
    <polygon
      fill="#FFFFFF"
      points="15.9033203 18.2246094 15.9033203 18.3710938 11.2304688 20.5317383 11.2304688 22.8095703 18.0566406 19.184082 18.0566406 17.4116211 11.2304688 13.7788086 11.2304688 16.0639648"
    />
    <rect fill="#FFFFFF" x="22" y="11" width="2" height="14">
      <animate
        attributeName="opacity"
        begin_="100ms"
        dur="2s"
        values="1;0"
        calcMode="discrete"
        repeatCount="indefinite"
      />
    </rect>
  </svg>;
