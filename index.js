// Show modal
document.getElementById('openContact').onclick = function() {
    document.getElementById('contactModal').classList.add('active');
  };
  // Hide modal
  document.getElementById('closeModal').onclick = function() {
    document.getElementById('contactModal').classList.remove('active');
  };
  // Close modal when clicking outside form
  document.getElementById('contactModal').onclick = function(e) {
    if (e.target === this) {
      this.classList.remove('active');
    }
  };
  // Form submission
  document.getElementById('contactForm').onsubmit = function(e) {
    e.preventDefault();
    alert("Thank you! Your message has been sent.");
    document.getElementById('contactModal').classList.remove('active');
    this.reset();
  };
  