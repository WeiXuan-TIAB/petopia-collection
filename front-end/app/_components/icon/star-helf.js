
export default function StarHelf({ className = "" ,color="#EE5A36"}) {
  return (
    <svg
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-colors duration-300 ${className}`}>
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stopColor={color} />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
      <path d="M13.6709 4.39062C14.7186 1.16603 19.2814 1.16605 20.3291 4.39062L22.2432 10.2832C22.3101 10.4892 22.5022 10.6289 22.7188 10.6289H28.915C32.3053 10.6292 33.7146 14.9671 30.9717 16.96L25.959 20.6025C25.7841 20.7299 25.7105 20.9553 25.7773 21.1611L27.6924 27.0537C28.7401 30.2783 25.0496 32.9595 22.3066 30.9668L17.2939 27.3252C17.1187 27.1979 16.8813 27.1979 16.7061 27.3252L11.6934 30.9668C8.95037 32.9595 5.25991 30.2782 6.30762 27.0537L8.22266 21.1611C8.28948 20.9553 8.21588 20.7299 8.04102 20.6025L3.02832 16.96C0.285402 14.9671 1.69468 10.6292 5.08496 10.6289H11.2812C11.4978 10.6289 11.6899 10.4892 11.7568 10.2832L13.6709 4.39062Z" fill="url(#half)" stroke={color} strokeWidth="3" />
    </svg>

  )
}