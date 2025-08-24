export type CategoryTagProps = {
  name?: string;
  scheme?: "hsl" | "palette";
  className?: string;
  style?: React.CSSProperties;
};

export default function CategoryTag({name, scheme="hsl", className="", style}
:CategoryTagProps){
    if (!name) return null; 
    function stringToColor(str:string, s=65, l=55){
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
        const h = Math.abs(hash) % 360;
        return `hsl(${h}deg ${s}% ${l}%)`;
    }

    const palette = [
        "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF",
        "#9D4EDD", "#FF922B", "#20C997", "#228BE6",
    ];

    function hashCode(str: string) {
        let h = 0; for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h);
        return h;
    }

    function pickFromPalette(str: string) {
        const idx = Math.abs(hashCode(str)) % palette.length;
        return palette[idx];
    }

    function readableTextColor(bg: string): "black" | "white" {
        if (bg.startsWith("hsl")) {
        const m = bg.match(/hsl\(\s*([\d.]+)[^\d]+([\d.]+)%[^\d]+([\d.]+)%\s*\)/i);
        if (m) {
            const h = parseFloat(m[1]);
            const s = parseFloat(m[2]) / 100;
            const l = parseFloat(m[3]) / 100;
            const a = s * Math.min(l, 1 - l);
            const f = (n: number) => {
            const k = (n + h / 30) % 12;
            const c = l - a * Math.max(-1, Math.min(k - 3, Math.min(9 - k, 1)));
            return Math.round(c * 255);
            };
            const r = f(0), g = f(8), b = f(4);
            const yiq = (r * 299 + g * 587 + b * 114) / 1000;
            return yiq >= 140 ? "black" : "white";
        }
        }
        if (bg.startsWith("#")) {
        const hex = bg.replace("#", "");
        const bigint = parseInt(hex.length === 3 ? hex.split("").map(c=>c+c).join("") : hex, 16);
        const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
        const yiq = (r * 299 + g * 587 + b * 114) / 1000;
        return yiq >= 140 ? "black" : "white";
        }
        return "white";
    }

    const bg = scheme === "hsl" ? stringToColor(name) : pickFromPalette(name);
    const baseTagStyle: React.CSSProperties = {
        background: "transparent",
        maxWidth: "50px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "0.75rem",
        padding: "0.15em",
        verticalAlign: "middle",
    };

    return (
        <span
            className={`badge py-2 fw-medium ${className}`}
            title={name}
            style={{
                ...baseTagStyle,
                border: `1.5px solid ${bg}`,
                color: bg, 
                ...style, 
            }}
            >
            {name}
        </span>
    );
}