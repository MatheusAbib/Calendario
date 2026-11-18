import "./BotanicalBackground.css";

const ornaments = [
  { type: "fern", side: "left", top: "0.8%", size: 205, rotate: -19, offset: 0 },
  { type: "lavender", side: "right", top: "2.4%", size: 112, rotate: 16, offset: 22 },
  { type: "wildflower", side: "left", top: "6.8%", size: 138, rotate: 11, offset: 28 },
  { type: "compound", side: "right", top: "8.1%", size: 184, rotate: -13, offset: 0 },
  { type: "daisy", side: "right", top: "12.7%", size: 104, rotate: 24, offset: 44 },
  { type: "branch", side: "left", top: "14.2%", size: 166, rotate: -8, offset: 12 },
  { type: "flower", side: "left", top: "18.3%", size: 121, rotate: 17, offset: 38 },
  { type: "fern", side: "right", top: "19.8%", size: 218, rotate: 21, offset: 0 },
  { type: "lavender", side: "left", top: "24.5%", size: 97, rotate: -23, offset: 48 },
  { type: "wildflower", side: "right", top: "26.1%", size: 148, rotate: -14, offset: 18 },
  { type: "compound", side: "left", top: "28.9%", size: 192, rotate: 12, offset: 0 },
  { type: "daisy", side: "left", top: "33.4%", size: 110, rotate: -18, offset: 52 },
  { type: "branch", side: "right", top: "34.6%", size: 173, rotate: 19, offset: 7 },
  { type: "flower", side: "right", top: "38.9%", size: 126, rotate: -24, offset: 42 },
  { type: "fern", side: "left", top: "40.3%", size: 226, rotate: -15, offset: 0 },
  { type: "lavender", side: "right", top: "44.8%", size: 105, rotate: 27, offset: 55 },
  { type: "wildflower", side: "left", top: "46.7%", size: 145, rotate: 20, offset: 20 },
  { type: "compound", side: "right", top: "49.5%", size: 198, rotate: -17, offset: 0 },
  { type: "daisy", side: "right", top: "53.9%", size: 103, rotate: 13, offset: 46 },
  { type: "branch", side: "left", top: "55.2%", size: 180, rotate: -22, offset: 5 },
  { type: "flower", side: "left", top: "59.6%", size: 116, rotate: 25, offset: 50 },
  { type: "fern", side: "right", top: "61.3%", size: 212, rotate: 15, offset: 0 },
  { type: "lavender", side: "left", top: "65.4%", size: 111, rotate: -12, offset: 36 },
  { type: "wildflower", side: "right", top: "67.1%", size: 154, rotate: 22, offset: 13 },
  { type: "compound", side: "left", top: "70.2%", size: 189, rotate: -19, offset: 0 },
  { type: "daisy", side: "left", top: "74.6%", size: 108, rotate: 29, offset: 43 },
  { type: "branch", side: "right", top: "75.8%", size: 171, rotate: -12, offset: 8 },
  { type: "flower", side: "right", top: "80.1%", size: 124, rotate: 18, offset: 49 },
  { type: "fern", side: "left", top: "81.6%", size: 222, rotate: -24, offset: 0 },
  { type: "lavender", side: "right", top: "85.9%", size: 99, rotate: -16, offset: 40 },
  { type: "wildflower", side: "left", top: "87.5%", size: 143, rotate: 14, offset: 24 },
  { type: "compound", side: "right", top: "90.2%", size: 183, rotate: 20, offset: 0 },
  { type: "daisy", side: "right", top: "93.4%", size: 106, rotate: -21, offset: 38 },
  { type: "branch", side: "left", top: "94.8%", size: 168, rotate: 12, offset: 11 }
];

function Fern() {
  return (
    <svg viewBox="0 0 220 340" fill="none" aria-hidden="true">
      <path d="M108 330C115 250 110 145 110 15" stroke="#657247" strokeWidth="2.5"/>
      {Array.from({ length: 13 }, (_, i) => {
        const y = 35 + i * 20;
        const width = Math.sin((i + 1) / 14 * Math.PI) * 85;
        return (
          <g key={i}>
            <path d={`M110 ${y + 9} Q${110 - width * 0.6} ${y - 18} ${110 - width} ${y - 35} Q${110 - width * 0.65} ${y + 9} 110 ${y + 9}Z`} fill="#8B9A65" stroke="#52653F" strokeWidth="1.2"/>
            <path d={`M110 ${y + 9} Q${110 + width * 0.6} ${y - 18} ${110 + width} ${y - 35} Q${110 + width * 0.65} ${y + 9} 110 ${y + 9}Z`} fill="#A1AB78" stroke="#52653F" strokeWidth="1.2"/>
            <path d={`M110 ${y + 9}L${110 - width} ${y - 35}M110 ${y + 9}L${110 + width} ${y - 35}`} stroke="#657247" strokeWidth=".8"/>
          </g>
        );
      })}
    </svg>
  );
}

function Flower() {
  return (
    <svg viewBox="0 0 240 320" fill="none" aria-hidden="true">
      <path d="M120 310Q95 235 121 130" stroke="#627044" strokeWidth="3"/>
      <path d="M112 235Q53 183 36 207Q52 253 112 235Z" fill="#A2AD76" stroke="#667548" strokeWidth="1.5"/>
      <path d="M115 195Q171 151 191 174Q169 211 115 195Z" fill="#8C9E6A" stroke="#667548" strokeWidth="1.5"/>
      <path d="M112 235Q74 218 36 207M115 195Q153 181 191 174" stroke="#667548" strokeWidth="1"/>
      {Array.from({ length: 7 }, (_, i) => (
        <ellipse
          key={i}
          cx="120"
          cy="77"
          rx="20"
          ry="54"
          transform={`rotate(${i * 360 / 7} 120 117)`}
          fill={i % 2 ? "#D9A18B" : "#E6B8A0"}
          stroke="#A96D59"
          strokeWidth="1.5"
        />
      ))}
      <circle cx="120" cy="117" r="20" fill="#D8B76C" stroke="#8C7445" strokeWidth="2"/>
      {Array.from({ length: 12 }, (_, i) => {
        const angle = i * Math.PI / 6;
        return <circle key={i} cx={120 + Math.cos(angle) * 12} cy={117 + Math.sin(angle) * 12} r="2" fill="#8B6A3F"/>;
      })}
    </svg>
  );
}

function Branch() {
  return (
    <svg viewBox="0 0 240 330" fill="none" aria-hidden="true">
      <path d="M85 320Q155 205 128 18" stroke="#746947" strokeWidth="3"/>
      {Array.from({ length: 8 }, (_, i) => {
        const y = 42 + i * 31;
        const right = i % 2 === 0;
        const x = 128 + (right ? 6 : -6);
        return (
          <g key={i}>
            <path d={`M${x} ${y + 35}Q${right ? 205 : 45} ${y + 8} ${right ? 210 : 37} ${y - 19}Q${right ? 160 : 83} ${y - 21} ${x} ${y + 35}Z`} fill={right ? "#B6A46A" : "#8C9B68"} stroke="#6D7147" strokeWidth="1.5"/>
            <path d={`M${x} ${y + 35}L${right ? 210 : 37} ${y - 19}`} stroke="#6D7147" strokeWidth="1"/>
          </g>
        );
      })}
      <path d="M90 308Q52 270 30 284Q39 315 90 308Z" fill="#A7A071" stroke="#6D7147" strokeWidth="1.5"/>
    </svg>
  );
}

function Lavender() {
  return (
    <svg viewBox="0 0 180 330" fill="none" aria-hidden="true">
      <path d="M85 320Q95 215 91 42M100 320Q113 207 125 68M72 320Q59 220 52 91" stroke="#69744E" strokeWidth="2.5"/>
      {[91,125,52].map((x, stem) =>
        Array.from({ length: 12 }, (_, i) => {
          const y = 45 + stem * 24 + i * 10;
          return (
            <g key={`${stem}-${i}`}>
              <ellipse cx={x - 7} cy={y} rx="7" ry="11" fill="#9983A5" stroke="#77658B" strokeWidth=".8"/>
              <ellipse cx={x + 7} cy={y - 4} rx="7" ry="11" fill="#B09ABB" stroke="#77658B" strokeWidth=".8"/>
            </g>
          );
        })
      )}
      <path d="M91 255Q38 200 25 227Q43 268 91 255ZM98 239Q155 194 167 215Q144 253 98 239Z" fill="#96A17A" stroke="#63734F" strokeWidth="1.5"/>
    </svg>
  );
}

function Daisy() {
  return (
    <svg viewBox="0 0 200 330" fill="none" aria-hidden="true">
      <path d="M100 320Q78 218 101 113" stroke="#63734E" strokeWidth="3"/>
      <path d="M92 240Q28 191 22 219Q42 259 92 240ZM96 200Q160 162 175 190Q150 221 96 200Z" fill="#8B9B69" stroke="#61724A" strokeWidth="1.5"/>
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx="101" cy="71" rx="12" ry="40" transform={`rotate(${i * 30} 101 110)`} fill="#F0E3C8" stroke="#B4A488" strokeWidth="1"/>
      ))}
      <circle cx="101" cy="110" r="20" fill="#D5AE58" stroke="#94743B" strokeWidth="1.5"/>
      {Array.from({ length: 16 }, (_, i) => {
        const a = i * Math.PI / 8;
        return <circle key={i} cx={101 + Math.cos(a) * 13} cy={110 + Math.sin(a) * 13} r="1.7" fill="#9A753B"/>;
      })}
    </svg>
  );
}

function Wildflower() {
  return (
    <svg viewBox="-35 -35 260 390" fill="none" aria-hidden="true">
      <path d="M90 320Q100 210 91 95M91 240Q50 181 35 130M93 215Q145 168 155 115" stroke="#68744C" strokeWidth="2.5"/>
      {[[91,90],[35,125],[155,110]].map(([x,y], i) => (
        <g key={i}>
          {Array.from({ length: 5 }, (_, p) => (
            <ellipse key={p} cx={x} cy={y - 19} rx="12" ry="24" transform={`rotate(${p * 72} ${x} ${y})`} fill={i === 1 ? "#CDA6B4" : "#D7A18E"} stroke="#A77377" strokeWidth="1"/>
          ))}
          <circle cx={x} cy={y} r="9" fill="#D9BC72" stroke="#9B814C" strokeWidth="1.5"/>
        </g>
      ))}
      <path d="M92 258Q43 217 23 239Q48 277 92 258ZM95 275Q143 236 165 255Q143 287 95 275Z" fill="#A0A979" stroke="#68744C" strokeWidth="1.5"/>
    </svg>
  );
}

function Compound() {
  return (
    <svg viewBox="0 0 200 330" fill="none" aria-hidden="true">
      <path d="M98 325Q105 195 102 25" stroke="#6D7350" strokeWidth="3"/>
      {Array.from({ length: 10 }, (_, i) => {
        const y = 40 + i * 25;
        const spread = 55 + (i % 3) * 9;
        return (
          <g key={i}>
            <path d={`M102 ${y + 16}Q${102 - spread / 2} ${y - 25} ${102 - spread} ${y - 12}Q${102 - spread / 2} ${y + 24} 102 ${y + 16}Z`} fill="#9BA777" stroke="#65744F" strokeWidth="1.2"/>
            <path d={`M102 ${y + 16}Q${102 + spread / 2} ${y - 25} ${102 + spread} ${y - 12}Q${102 + spread / 2} ${y + 24} 102 ${y + 16}Z`} fill="#B2B58A" stroke="#65744F" strokeWidth="1.2"/>
            <path d={`M102 ${y + 16}L${102 - spread} ${y - 12}M102 ${y + 16}L${102 + spread} ${y - 12}`} stroke="#65744F" strokeWidth=".7"/>
          </g>
        );
      })}
    </svg>
  );
}
export default function BotanicalBackground() {
  return (
    <div className="botanical-background" aria-hidden="true">
      {ornaments.map((ornament, index) => (
        <div
          key={index}
          className={`botanical-background-ornament botanical-background-ornament--${ornament.side}`}
          style={{
            top: ornament.top,
            width: ornament.size, "--botanical-size": `${ornament.size}px`, "--botanical-offset": `${ornament.offset}px`,
            transform: `rotate(${ornament.rotate}deg)`
          }}
        >
          {ornament.type === "fern" && <Fern />}
          {ornament.type === "flower" && <Flower />}
          {ornament.type === "branch" && <Branch />}
          {ornament.type === "lavender" && <Lavender />}
          {ornament.type === "daisy" && <Daisy />}
          {ornament.type === "wildflower" && <Wildflower />}
          {ornament.type === "compound" && <Compound />}
        </div>
      ))}
    </div>
  );
}




