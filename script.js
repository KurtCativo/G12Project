// Add event listener to navigation links
document.querySelectorAll('nav a').forEach(function(link) {
	link.addEventListener('click', function(event) {
		event.preventDefault();
		document.querySelector(link.getAttribute('href')).scrollIntoView();
	});
});

