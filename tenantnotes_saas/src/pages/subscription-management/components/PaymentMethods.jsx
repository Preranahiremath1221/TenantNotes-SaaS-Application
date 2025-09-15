import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentMethods = ({ subscription }) => {
  const [showAddCard, setShowAddCard] = useState(false);

  // Mock payment methods data
  const paymentMethods = [
    {
      id: 'pm_001',
      type: 'card',
      brand: 'visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
      cardholderName: 'John Smith'
    },
    {
      id: 'pm_002',
      type: 'card',
      brand: 'mastercard',
      last4: '5555',
      expiryMonth: 8,
      expiryYear: 2026,
      isDefault: false,
      cardholderName: 'John Smith'
    }
  ];

  const getCardIcon = (brand) => {
    const icons = {
      visa: 'CreditCard',
      mastercard: 'CreditCard',
      amex: 'CreditCard',
      discover: 'CreditCard'
    };
    return icons?.[brand] || 'CreditCard';
  };

  const getCardBrandColor = (brand) => {
    const colors = {
      visa: 'text-blue-600',
      mastercard: 'text-red-600',
      amex: 'text-green-600',
      discover: 'text-orange-600'
    };
    return colors?.[brand] || 'text-muted-foreground';
  };

  const formatCardBrand = (brand) => {
    return brand?.charAt(0)?.toUpperCase() + brand?.slice(1);
  };

  const handleSetDefault = (paymentMethodId) => {
    console.log('Setting default payment method:', paymentMethodId);
    // Implementation would update the default payment method
  };

  const handleRemoveCard = (paymentMethodId) => {
    console.log('Removing payment method:', paymentMethodId);
    // Implementation would remove the payment method
  };

  if (subscription?.plan === 'Free') {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Payment Methods
          </h3>
          <Icon name="CreditCard" size={20} className="text-muted-foreground" />
        </div>
        
        <div className="text-center py-8">
          <Icon name="CreditCard" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">
            No payment methods required
          </p>
          <p className="text-sm text-muted-foreground">
            You're currently on the Free plan
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Payment Methods
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddCard(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Add Card
        </Button>
      </div>
      {/* Payment Methods List */}
      <div className="space-y-4">
        {paymentMethods?.map((method) => (
          <div
            key={method?.id}
            className={`
              flex items-center justify-between p-4 border rounded-lg transition-colors
              ${method?.isDefault 
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
              }
            `}
          >
            <div className="flex items-center space-x-4">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center
                ${method?.isDefault ? 'bg-primary/10' : 'bg-muted'}
              `}>
                <Icon 
                  name={getCardIcon(method?.brand)} 
                  size={20} 
                  className={method?.isDefault ? 'text-primary' : getCardBrandColor(method?.brand)}
                />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-foreground">
                    {formatCardBrand(method?.brand)} •••• {method?.last4}
                  </span>
                  {method?.isDefault && (
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                      Default
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Expires {method?.expiryMonth?.toString()?.padStart(2, '0')}/{method?.expiryYear}
                </div>
                <div className="text-xs text-muted-foreground">
                  {method?.cardholderName}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {!method?.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSetDefault(method?.id)}
                >
                  Set Default
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveCard(method?.id)}
                iconName="Trash2"
                iconSize={16}
                className="text-error hover:text-error"
              >
                <span className="sr-only">Remove card</span>
              </Button>
            </div>
          </div>
        ))}
      </div>
      {/* Add Card Form */}
      {showAddCard && (
        <div className="mt-6 p-4 border border-border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-foreground">Add New Card</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddCard(false)}
              iconName="X"
              iconSize={16}
            >
              <span className="sr-only">Cancel</span>
            </Button>
          </div>
          
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground">
              Card management functionality would be implemented here
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setShowAddCard(false)}
            >
              Close
            </Button>
          </div>
        </div>
      )}
      {/* Security Notice */}
      <div className="mt-6 p-3 bg-muted/30 border border-border rounded-lg">
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={16} className="text-success" />
          <div className="text-sm">
            <span className="font-medium text-foreground">Secure Payment</span>
            <p className="text-muted-foreground">
              Your payment information is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;