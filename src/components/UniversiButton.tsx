import React from 'react';

interface ButtonProps {
    colors: {
        background: string;
        border?: string;
        text: string;
    };
    onHover: {
        background: string;
        text: string;
    };
    onClick: () => void;
    children: React.ReactNode;
}

const UniversiButton: React.FC<ButtonProps> = ({ colors, onHover, onClick, children }) => {
    const border = colors.border || colors.background;

    const styles = {
        default: {
            backgroundColor: colors.background,
            borderColor: border,
            color: colors.text,
            textTransform: 'uppercase',
            borderRadius: '8px',
            fontWeight: 'bold',
            padding: '10px 20px',
            cursor: 'pointer',
            transition: 'all 0.3s',
        },
        hover: {
            backgroundColor: onHover.background,
            color: onHover.text,
        }
    };

    return (
        <button
            style={styles.default}
            onClick={onClick}
            onMouseEnter={() => Object.assign(styles.default, styles.hover)}
            onMouseLeave={() => Object.assign(styles.default, { backgroundColor: colors.background, color: colors.text })}
        >
            {children}
        </button>
    );
}

export default UniversiButton;