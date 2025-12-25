export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const generateApplicationNumber = (prefix: string = 'APP'): string => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

export const calculateEMI = (
  principal: number,
  annualRate: number,
  tenureMonths: number
): number => {
  const monthlyRate = annualRate / 100 / 12;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1);
  return Math.round(emi * 100) / 100;
};

export const generateRepaymentSchedule = (
  principal: number,
  annualRate: number,
  tenureMonths: number,
  startDate: Date = new Date()
) => {
  const monthlyRate = annualRate / 100 / 12;
  const emi = calculateEMI(principal, annualRate, tenureMonths);
  const schedule = [];
  
  let remainingPrincipal = principal;
  
  for (let i = 0; i < tenureMonths; i++) {
    const interestAmount = remainingPrincipal * monthlyRate;
    const principalAmount = emi - interestAmount;
    remainingPrincipal -= principalAmount;
    
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i + 1);
    
    schedule.push({
      id: `installment-${i + 1}`,
      installmentNumber: i + 1,
      dueDate: dueDate.toISOString(),
      principalAmount: Math.round(principalAmount * 100) / 100,
      interestAmount: Math.round(interestAmount * 100) / 100,
      totalAmount: Math.round(emi * 100) / 100,
      status: 'pending' as const,
    });
  }
  
  return schedule;
};


