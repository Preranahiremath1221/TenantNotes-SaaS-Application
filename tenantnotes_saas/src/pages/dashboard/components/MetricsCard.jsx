import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricsCard = ({ title, value, subtitle, icon, variant = 'default', progress, onClick }) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'success':
        return 'border-accent/20 bg-accent/5';
      case 'primary':
        return 'border-primary/20 bg-primary/5';
      default:
        return 'border-border bg-card';
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case 'warning':
        return 'var(--color-warning)';
      case 'success':
        return 'var(--color-accent)';
      case 'primary':
        return 'var(--color-primary)';
      default:
        return 'var(--color-muted-foreground)';
    }
  };

  return (
    <div 
      className={`p-6 rounded-lg border transition-micro ${getVariantStyles()} ${onClick ? 'cursor-pointer hover:shadow-card-elevation-1' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-muted/50">
            <Icon name={icon} size={20} color={getIconColor()} />
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
      </div>
      <div className="space-y-2">
        <div className="text-2xl font-semibold text-foreground">{value}</div>
        {subtitle && (
          <div className="text-sm text-muted-foreground">{subtitle}</div>
        )}
        
        {progress && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Usage</span>
              <span>{progress?.current}/{progress?.total}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  progress?.percentage >= 80 ? 'bg-warning' : 'bg-accent'
                }`}
                style={{ width: `${Math.min(progress?.percentage, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricsCard;