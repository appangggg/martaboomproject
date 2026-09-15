import React from 'react';

export default function ProductCard({ product, onAdd }) {
  return (
    <div 
      className="group relative bg-surface-container-lowest rounded-2xl p-space-md shadow-[0_4px_16px_-2px_rgba(70,42,25,0.06)] hover:shadow-lg transition-all duration-150 flex flex-col justify-between cursor-pointer active:translate-y-0.5" 
      onClick={() => onAdd(product)}
    >
      <div className="relative w-full h-40 rounded-xl overflow-hidden mb-space-sm bg-surface-container-low">
        <img 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          src={product.image} 
          alt={product.name} 
        />
        
        {product.badge && (
          <div className={`absolute top-2.5 left-2.5 ${product.badge.bgClass} font-label-sm text-label-sm px-2.5 py-1 rounded-full font-extrabold shadow-sm flex items-center gap-1`}>
            <span className="material-symbols-outlined text-[14px]">{product.badge.icon}</span>
            <span>{product.badge.text}</span>
          </div>
        )}
        
        {product.label && (
          <div className="absolute bottom-2 right-2 bg-surface-container-lowest/90 backdrop-blur-sm px-2 py-0.5 rounded-lg text-label-sm font-label-sm text-on-surface-variant">
            {product.label}
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-title-lg text-title-lg text-on-surface leading-snug line-clamp-2">{product.name}</h3>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">{product.description}</p>
        </div>
        <div className="mt-space-md pt-space-xs flex items-center justify-between">
          <span className="font-title-lg text-title-lg text-primary font-black">
            Rp {product.price.toLocaleString('id-ID')}
          </span>
          <button 
            className="w-10 h-10 rounded-full bg-surface-container hover:bg-primary hover:text-on-primary text-primary flex items-center justify-center transition-colors shadow-sm" 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
          >
            <span className="material-symbols-outlined text-[22px]">add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
