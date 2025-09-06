
export const OptionsIcon = ({ size = 20, color = "#333", style ={}, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    style={{cursor: 'pointer',position: 'relative',left: '200px', ...style}}
    {...props}
  >
    <circle cx="10" cy="4" r="2" fill={color} />
    <circle cx="10" cy="10" r="2" fill={color} />
    <circle cx="10" cy="16" r="2" fill={color} />
  </svg>
);