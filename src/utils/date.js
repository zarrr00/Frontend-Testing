export const formatDate = (dateString) => 
  new Date(dateString).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
