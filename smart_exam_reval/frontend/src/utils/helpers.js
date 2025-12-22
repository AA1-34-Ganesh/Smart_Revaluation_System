export const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
        return ''; // or return some default like 'Invalid date'
    }
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return ''; // or return some default like '₹0.00'
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
};
