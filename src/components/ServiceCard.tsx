'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  href?: string;
  index?: number;
}

export default function ServiceCard({ title, description, Icon, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-start gap-4 hover:shadow-2xl hover:shadow-brand-accent/20 transition-all cursor-pointer group"
    >
      <div className="p-4 bg-brand-accent/10 rounded-xl group-hover:bg-brand-accent/20 transition-colors">
        <Icon className="w-8 h-8 text-brand-accent" />
      </div>
      
      <h3 className="text-xl font-bold text-foreground">
        {title}
      </h3>
      
      <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
