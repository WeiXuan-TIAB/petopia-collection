'use client'
import { useState } from 'react';
import * as motion from 'motion/react-client';
import Image from 'next/image';

export default function PopularSection({ 
  title, 
  popularItems = [],
  onItemClick,
  enableCardHover = false  // 預設 false
}) {
  const [hoveredItemId, setHoveredItemId] = useState(null);

  // 預設資料
  const defaultItems = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=300&h=160&fit=crop",
      alt: "可愛小狗們",
      description: "十個暖心瞬間！汽車旅行台灣找到適意與願希望主人..."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=160&fit=crop",
      alt: "黃金獵犬幼犬",
      description: "夏天來到！白色的我夏威觀察發隱動作於安..."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?w=300&h=160&fit=crop",
      alt: "溫馨寵物時光",
      description: "超越照顧的無條件愛！愛護主人的決裝與信心..."
    }
  ];

  const items = popularItems.length > 0 ? popularItems : defaultItems;

  const handleItemClick = (item) => {
    if (onItemClick) onItemClick(item);
  };

  const handleItemMouseEnter = (itemId) => {
    if (enableCardHover) setHoveredItemId(itemId);
  };

  const handleItemMouseLeave = () => {
    if (enableCardHover) setHoveredItemId(null);
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4"> 
        <div className="w-1 h-5 bg-[#1A9562]"></div> 
        <h2 className="text-2xl">{title}</h2> 
      </div>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item, index) => {
          const itemId = item.id || index;
          const isHovered = hoveredItemId === itemId;
          const CardComponent = enableCardHover ? motion.div : 'div';

          return (
            <CardComponent
              key={itemId}  // ✅ React 要求唯一 key
              className="group rounded overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => handleItemMouseEnter(itemId)}
              onMouseLeave={handleItemMouseLeave}
              {...(enableCardHover && {
                animate: {
                  scale: isHovered ? 1.05 : 1,
                  y: isHovered ? -8 : 0,
                },
                transition: { duration: 0.3, ease: "easeOut" },
                whileHover: { boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }
              })}
            >
              <Image 
                src={item.image}
                alt={item.alt}
                className="w-full aspect-video object-cover rounded-4xl"
              />
              <div className="p-4">
                <p className="text-gray-800 group-hover:text-[var(--puppy-orange)] transition-colors">
                  {item.description}
                </p>
              </div>
            </CardComponent>
          );
        })}
      </div>
    </section>
  );
}
