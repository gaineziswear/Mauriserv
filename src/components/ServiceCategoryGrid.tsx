import React, { useState } from 'react';
import {
  Wrench,
  Zap,
  Wind,
  Sparkles,
  Hammer,
  Flower2,
  Paintbrush,
  Refrigerator,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Language, ServiceCategory } from '../types';
import { translations } from '../translations';

interface ServiceCategoryGridProps {
  categories: ServiceCategory[];
  lang: Language;
  onSelectCategory: (categoryId: string, subcategory?: string) => void;
}

export const ServiceCategoryGrid: React.FC<ServiceCategoryGridProps> = ({
  categories,
  lang,
  onSelectCategory,
}) => {
  const t = translations[lang];
  const [activeFilter, setActiveFilter] = useState<string>('ALL');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return <Wrench className="w-5 h-5" />;
      case 'Zap':
        return <Zap className="w-5 h-5" />;
      case 'Wind':
        return <Wind className="w-5 h-5" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5" />;
      case 'Hammer':
        return <Hammer className="w-5 h-5" />;
      case 'Flower2':
        return <Flower2 className="w-5 h-5" />;
      case 'Paintbrush':
        return <Paintbrush className="w-5 h-5" />;
      case 'Refrigerator':
        return <Refrigerator className="w-5 h-5" />;
      default:
        return <Wrench className="w-5 h-5" />;
    }
  };

  const filteredCategories =
    activeFilter === 'ALL'
      ? categories
      : activeFilter === 'EMERGENCY'
      ? categories.filter((c) => c.emergencyAvailable)
      : categories;

  return (
    <section className="py-16 bg-[#FBFBF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1">
              {lang === 'en' ? 'Verified Tradesmen' : 'Artisans Certifiés'}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 font-display">
              {t.services.title}
            </h2>
            <p className="text-stone-600 mt-1 max-w-xl text-sm sm:text-base">
              {t.services.subtitle}
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex items-center gap-2 bg-stone-200/70 p-1 rounded-xl text-xs font-bold shrink-0">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'ALL'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {t.services.allCategories}
            </button>
            <button
              onClick={() => setActiveFilter('EMERGENCY')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                activeFilter === 'EMERGENCY'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-rose-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? '24/7 Emergency' : 'Urgences 24/7'}</span>
            </button>
          </div>
        </div>

        {/* Visual Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((category) => {
            const name = lang === 'fr' ? category.nameFr : category.nameEn;
            const desc = lang === 'fr' ? category.descriptionFr : category.descriptionEn;
            const subcategories =
              lang === 'fr'
                ? category.popularSubcategoriesFr
                : category.popularSubcategoriesEn;

            return (
              <div
                key={category.id}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Card Top: High Quality Photo + Overlay */}
                <div>
                  <div className="relative h-44 overflow-hidden bg-stone-900">
                    <img
                      src={category.imageUrl}
                      alt={name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-black/30" />

                    {/* Icon Badge */}
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-md text-emerald-900 flex items-center justify-center shadow-md">
                      {getCategoryIcon(category.iconName)}
                    </div>

                    {/* Emergency Tag */}
                    {category.emergencyAvailable && (
                      <div className="absolute top-3 right-3 bg-rose-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        <span>24/7</span>
                      </div>
                    )}

                    {/* Category Title on Banner */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-bold text-white tracking-tight drop-shadow-xs">
                        {name}
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {desc}
                    </p>

                    {/* Subcategories tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {subcategories.slice(0, 3).map((sub, idx) => (
                        <button
                          key={idx}
                          onClick={() => onSelectCategory(category.id, sub)}
                          className="bg-stone-100 hover:bg-emerald-50 hover:text-emerald-900 text-stone-600 text-[11px] font-medium px-2 py-0.5 rounded-md transition-colors text-left"
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer: Pricing & Action */}
                <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between mt-2">
                  <div>
                    <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
                      {t.services.startingFrom}
                    </div>
                    <div className="text-sm font-black text-stone-900">
                      Rs {category.startingPriceMUR.toLocaleString()}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectCategory(category.id)}
                    className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-xs active:scale-95"
                  >
                    <span>{t.services.requestNow}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
