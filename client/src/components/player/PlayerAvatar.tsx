type PlayerAvatarProps = {
  nickname: string;
  avatar?: string;
  size?: 'sm' | 'md' | 'lg';
};

export default function PlayerAvatar({
  nickname,
  avatar,
  size = 'md',
}: PlayerAvatarProps) {
  const sizeClass = {
    sm: 'h-9 w-9 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-16 w-16 text-xl',
  }[size];

  return (
    <div
      className={`
        ${sizeClass}
        flex
        shrink-0
        items-center
        justify-center
        overflow-hidden
        rounded-2xl
        border
        border-[#9b5cff]/40
        bg-[#1b1f2e]
        font-bold
        text-[#d4b7ff]
      `}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={`Avatar de ${nickname}`}
          className="h-full w-full object-cover"
        />
      ) : (
        nickname
          .charAt(0)
          .toUpperCase()
      )}
    </div>
  );
}