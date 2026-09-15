import fs from 'fs';

const tailwindConfig = {"darkMode":"class","theme":{"extend":{"colors":{"surface-variant":"#ffdbc9","inverse-surface":"#462a19","surface":"#fff8f6","secondary-fixed":"#ffdf9f","on-secondary":"#ffffff","secondary":"#795900","surface-container":"#ffeae0","surface-container-high":"#ffe2d5","outline":"#857466","surface-container-highest":"#ffdbc9","surface-bright":"#fff8f6","on-error":"#ffffff","surface-dim":"#ffd0b8","tertiary":"#496729","inverse-primary":"#ffb873","tertiary-container":"#87a963","primary-fixed":"#ffdcbf","secondary-container":"#fdc74b","surface-tint":"#8c5000","on-tertiary":"#ffffff","on-primary-fixed-variant":"#6a3b00","error":"#ba1a1a","tertiary-fixed":"#caeea1","on-tertiary-fixed-variant":"#324e13","on-surface-variant":"#524438","on-secondary-fixed-variant":"#5c4300","on-secondary-container":"#715300","on-tertiary-container":"#223d03","outline-variant":"#d8c3b2","background":"#fff8f6","on-primary-fixed":"#2d1600","on-primary":"#ffffff","error-container":"#ffdad6","surface-container-low":"#fff1eb","on-background":"#2d1507","tertiary-fixed-dim":"#aed287","secondary-fixed-dim":"#f4bf44","on-secondary-fixed":"#261a00","inverse-on-surface":"#ffede5","primary":"#8c5000","primary-fixed-dim":"#ffb873","surface-container-lowest":"#ffffff","primary-container":"#d98e3f","on-tertiary-fixed":"#0e2000","on-surface":"#2d1507","on-primary-container":"#522d00","on-error-container":"#93000a"},"borderRadius":{"DEFAULT":"1rem","lg":"2rem","xl":"3rem","full":"9999px"},"spacing":{"margin":"1.5rem","space-xs":"0.375rem","space-lg":"1.5rem","space-xl":"2rem","space-md":"1rem","gutter":"1rem","space-sm":"0.75rem"},"fontFamily":{"body-md":["Plus Jakarta Sans"],"body-lg":["Plus Jakarta Sans"],"title-lg":["Plus Jakarta Sans"],"label-lg":["Plus Jakarta Sans"],"display-lg":["Plus Jakarta Sans"],"display-md":["Plus Jakarta Sans"],"title-md":["Plus Jakarta Sans"],"headline-md":["Plus Jakarta Sans"],"num-keypad":["Plus Jakarta Sans"],"label-sm":["Plus Jakarta Sans"],"label-md":["Plus Jakarta Sans"],"headline-lg":["Plus Jakarta Sans"],"num-display":["Plus Jakarta Sans"]},"fontSize":{"body-md":["14px",{"lineHeight":"20px","fontWeight":"500"}],"body-lg":["16px",{"lineHeight":"24px","fontWeight":"500"}],"title-lg":["18px",{"lineHeight":"24px","fontWeight":"700"}],"label-lg":["15px",{"lineHeight":"20px","letterSpacing":"0.02em","fontWeight":"700"}],"display-lg":["48px",{"lineHeight":"56px","letterSpacing":"-0.02em","fontWeight":"800"}],"display-md":["36px",{"lineHeight":"44px","letterSpacing":"-0.01em","fontWeight":"800"}],"title-md":["16px",{"lineHeight":"22px","fontWeight":"600"}],"headline-md":["22px",{"lineHeight":"28px","fontWeight":"700"}],"num-keypad":["28px",{"lineHeight":"34px","fontWeight":"700"}],"label-sm":["11px",{"lineHeight":"16px","letterSpacing":"0.04em","fontWeight":"700"}],"label-md":["13px",{"lineHeight":"18px","letterSpacing":"0.03em","fontWeight":"700"}],"headline-lg":["28px",{"lineHeight":"36px","letterSpacing":"-0.01em","fontWeight":"700"}],"num-display":["40px",{"lineHeight":"48px","letterSpacing":"-0.02em","fontWeight":"800"}]}}}};

let css = `@import "tailwindcss";\n\n@theme {\n`;

for (const [key, value] of Object.entries(tailwindConfig.theme.extend.colors)) {
  css += `  --color-${key}: ${value};\n`;
}

css += '\n';
for (const [key, value] of Object.entries(tailwindConfig.theme.extend.borderRadius)) {
  const k = key === 'DEFAULT' ? 'radius' : `radius-${key}`;
  css += `  --${k}: ${value};\n`;
}

css += '\n';
for (const [key, value] of Object.entries(tailwindConfig.theme.extend.spacing)) {
  css += `  --spacing-${key}: ${value};\n`;
}

css += '\n';
for (const [key, value] of Object.entries(tailwindConfig.theme.extend.fontFamily)) {
  css += `  --font-${key}: ${value.map(v => `"${v}"`).join(', ')};\n`;
}

css += '\n';
for (const [key, value] of Object.entries(tailwindConfig.theme.extend.fontSize)) {
  css += `  --text-${key}: ${value[0]};\n`;
  css += `  --text-${key}--line-height: ${value[1].lineHeight};\n`;
  css += `  --text-${key}--font-weight: ${value[1].fontWeight};\n`;
  if (value[1].letterSpacing) {
    css += `  --text-${key}--letter-spacing: ${value[1].letterSpacing};\n`;
  }
}

css += `}\n\n`;

// additional CSS
css += `@layer base{
  html,body{margin:0;padding:0;}
  body{overscroll-behavior:none;}
  main>:first-child{margin-top:0!important;}
  main>:last-child{margin-bottom:0!important;}
}
::-webkit-scrollbar{display:none;}
`;

fs.writeFileSync('c:/laragon/www/terbul/resources/js/kasir/index.css', css);
fs.writeFileSync('c:/laragon/www/terbul/resources/js/admin/index.css', css);

console.log('CSS written successfully');
