import React from 'react';

export default function BadgeGenerator({ title = "NUEVO TEMA" }) {
    return (
        <div className="relative w-full aspect-square flex items-center justify-center group">

            <div className="absolute inset-0 w-full h-full transition-transform group-hover:scale-105 duration-300">

                {/* 1. La imagen de fondo */}
                <img
                    src="/badge.svg"
                    alt={`Insignia de ${title}`}
                    className="absolute inset-0 w-full h-full object-contain z-0 drop-shadow-2xl"
                />

                {/* 2. El SVG con el texto recto */}
                <svg
                    viewBox="0 0 500 500"
                    className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                >
                    <text
                        x="250" /* Exactamente en el centro (50% de 500) */
                        y="365" /* Altura ajustada para la cinta negra */
                        fill="#FFFFFF"
                        fontSize="24"
                        fontWeight="bold"
                        fontFamily="Arial, Helvetica, sans-serif"
                        letterSpacing="2"
                        textAnchor="middle" /* Centra el texto horizontalmente */
                        dominantBaseline="middle" /* Centra el texto verticalmente */
                        style={{
                            textRendering: 'optimizeLegibility',
                            WebkitFontSmoothing: 'antialiased'
                        }}
                    >
                        {title.toUpperCase()}
                    </text>
                </svg>
            </div>
        </div>
    );
}