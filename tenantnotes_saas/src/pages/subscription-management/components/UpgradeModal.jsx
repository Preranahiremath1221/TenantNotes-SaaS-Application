import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const UpgradeModal = ({ 
  isOpen, 
  onClose, 
  selectedPlan, 
  onConfirmUpgrade,
  isProcessing = false 
}) => {
  const [step, setStep] = useState(1); // 1: Plan confirmation, 2: Payment details, 3: Processing
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    }
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    if (field?.includes('.')) {
      const [parent, child] = field?.split('.');
      setPaymentData(prev => ({
        ...prev,
        [parent]: {
          ...prev?.[parent],
          [child]: value
        }
      }));
    } else {
      setPaymentData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validatePaymentData = () => {
    const newErrors = {};
    
    if (!paymentData?.cardNumber || paymentData?.cardNumber?.length < 16) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!paymentData?.expiryDate || !/^\d{2}\/\d{2}$/?.test(paymentData?.expiryDate)) {
      newErrors.expiryDate = 'Please enter expiry date (MM/YY)';
    }
    
    if (!paymentData?.cvv || paymentData?.cvv?.length < 3) {
      newErrors.cvv = 'Please enter a valid CVV';
    }
    
    if (!paymentData?.cardholderName?.trim()) {
      newErrors.cardholderName = 'Please enter cardholder name';
    }
    
    if (!paymentData?.billingAddress?.street?.trim()) {
      newErrors['billingAddress.street'] = 'Please enter billing address';
    }
    
    if (!paymentData?.billingAddress?.city?.trim()) {
      newErrors['billingAddress.city'] = 'Please enter city';
    }
    
    if (!paymentData?.billingAddress?.zipCode?.trim()) {
      newErrors['billingAddress.zipCode'] = 'Please enter ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validatePaymentData()) {
        setStep(3);
        // Simulate processing
        setTimeout(() => {
          onConfirmUpgrade(selectedPlan, paymentData);
        }, 2000);
      }
    }
  };

  const handleClose = () => {
    setStep(1);
    setPaymentData({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      }
    });
    setErrors({});
    onClose();
  };

  const formatCardNumber = (value) => {
    const v = value?.replace(/\s+/g, '')?.replace(/[^0-9]/gi, '');
    const matches = v?.match(/\d{4,16}/g);
    const match = matches && matches?.[0] || '';
    const parts = [];
    for (let i = 0, len = match?.length; i < len; i += 4) {
      parts?.push(match?.substring(i, i + 4));
    }
    if (parts?.length) {
      return parts?.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value?.replace(/\s+/g, '')?.replace(/[^0-9]/gi, '');
    if (v?.length >= 2) {
      return v?.substring(0, 2) + '/' + v?.substring(2, 4);
    }
    return v;
  };

  if (!isOpen || !selectedPlan) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
      <div className="bg-card border border-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {step === 1 && 'Upgrade to Pro Plan'}
            {step === 2 && 'Payment Details'}
            {step === 3 && 'Processing Upgrade'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={step === 3}
            iconName="X"
            iconSize={20}
          >
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Step 1: Plan Confirmation */}
        {step === 1 && (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="ArrowUp" size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Upgrade to {selectedPlan?.name}
              </h3>
              <p className="text-muted-foreground">
                {selectedPlan?.description}
              </p>
            </div>

            {/* Plan Details */}
            <div className="bg-muted/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-foreground font-medium">Plan Details</span>
                <span className="text-2xl font-bold text-foreground">
                  ${selectedPlan?.price}/month
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-sm text-foreground">Unlimited notes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-sm text-foreground">Advanced features</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Check" size={16} className="text-success" />
                  <span className="text-sm text-foreground">Priority support</span>
                </div>
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Info" size={16} className="text-accent" />
                <span className="text-sm font-medium text-accent">Billing Information</span>
              </div>
              <p className="text-sm text-foreground">
                You will be charged ${selectedPlan?.price} monthly. You can cancel anytime from your subscription settings.
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleClose}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleNextStep}
                fullWidth
                iconName="ArrowRight"
                iconPosition="right"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Details */}
        {step === 2 && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Payment Information
                </h3>
                
                <Input
                  label="Card Number"
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentData?.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e?.target?.value))}
                  error={errors?.cardNumber}
                  maxLength={19}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Expiry Date"
                    type="text"
                    placeholder="MM/YY"
                    value={paymentData?.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e?.target?.value))}
                    error={errors?.expiryDate}
                    maxLength={5}
                    required
                  />
                  <Input
                    label="CVV"
                    type="text"
                    placeholder="123"
                    value={paymentData?.cvv}
                    onChange={(e) => handleInputChange('cvv', e?.target?.value?.replace(/\D/g, ''))}
                    error={errors?.cvv}
                    maxLength={4}
                    required
                  />
                </div>

                <Input
                  label="Cardholder Name"
                  type="text"
                  placeholder="John Doe"
                  value={paymentData?.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e?.target?.value)}
                  error={errors?.cardholderName}
                  required
                />
              </div>

              {/* Billing Address */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Billing Address
                </h3>
                
                <Input
                  label="Street Address"
                  type="text"
                  placeholder="123 Main Street"
                  value={paymentData?.billingAddress?.street}
                  onChange={(e) => handleInputChange('billingAddress.street', e?.target?.value)}
                  error={errors?.['billingAddress.street']}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="City"
                    type="text"
                    placeholder="New York"
                    value={paymentData?.billingAddress?.city}
                    onChange={(e) => handleInputChange('billingAddress.city', e?.target?.value)}
                    error={errors?.['billingAddress.city']}
                    required
                  />
                  <Input
                    label="State"
                    type="text"
                    placeholder="NY"
                    value={paymentData?.billingAddress?.state}
                    onChange={(e) => handleInputChange('billingAddress.state', e?.target?.value)}
                  />
                </div>

                <Input
                  label="ZIP Code"
                  type="text"
                  placeholder="10001"
                  value={paymentData?.billingAddress?.zipCode}
                  onChange={(e) => handleInputChange('billingAddress.zipCode', e?.target?.value)}
                  error={errors?.['billingAddress.zipCode']}
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                fullWidth
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back
              </Button>
              <Button
                variant="default"
                onClick={handleNextStep}
                fullWidth
                iconName="CreditCard"
                iconPosition="left"
              >
                Complete Upgrade
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Processing */}
        {step === 3 && (
          <div className="p-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Icon name="CreditCard" size={24} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Processing Your Upgrade
              </h3>
              <p className="text-muted-foreground mb-4">
                Please wait while we process your payment and activate your Pro plan.
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpgradeModal;