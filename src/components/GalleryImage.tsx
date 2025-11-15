import React from 'react';

type Props = {
  url: string;
  title: string;
};

function GalleryImage({ url, title }: Props) {
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
      <div className="aspect-square">
        <img
          src={url}
          alt={title}
          loading="lazy"
          decoding="async"
          fetchPriority="low"
          width={800}
          height={800}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h3 className="text-white text-xl font-semibold">{title}</h3>
        </div>
      </div>
    </div>
  );
}

export default React.memo(GalleryImage);
