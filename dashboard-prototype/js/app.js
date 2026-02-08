document.addEventListener('DOMContentLoaded', () => {
    // Sidebar Toggle Logic
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');

    // Only run if elements exist (e.g., on dashboard page)
    if (toggleBtn && sidebar && mainContent) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }

    // Add ripple effect or other interactions here if needed

    // Kanban Drag and Drop Logic
    const draggables = document.querySelectorAll('.kanban-card');
    const containers = document.querySelectorAll('.kanban-tasks');

    if (draggables.length > 0 && containers.length > 0) {
        draggables.forEach(draggable => {
            draggable.setAttribute('draggable', 'true');

            draggable.addEventListener('dragstart', () => {
                draggable.classList.add('dragging');
            });

            draggable.addEventListener('dragend', () => {
                draggable.classList.remove('dragging');
                updateColumnCounts();
            });
        });

        containers.forEach(container => {
            container.addEventListener('dragover', e => {
                e.preventDefault();
                const afterElement = getDragAfterElement(container, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (afterElement == null) {
                    container.appendChild(draggable);
                } else {
                    container.insertBefore(draggable, afterElement);
                }

                // Visual feedback for column
                const column = container.closest('.kanban-column');
                if (column) column.classList.add('drag-over');
            });

            container.addEventListener('dragleave', e => {
                const column = container.closest('.kanban-column');
                if (column) column.classList.remove('drag-over');
            });

            container.addEventListener('drop', e => {
                const column = container.closest('.kanban-column');
                if (column) column.classList.remove('drag-over');
            });
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.kanban-card:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function updateColumnCounts() {
        document.querySelectorAll('.kanban-column').forEach(column => {
            const count = column.querySelectorAll('.kanban-card').length;
            const countBadge = column.querySelector('.kanban-count');
            if (countBadge) countBadge.innerText = count;
        });
    }

    // Chart.js Initialization
    const chartCanvas = document.getElementById('revenueChart');
    if (chartCanvas) {
        new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Revenue',
                    data: [12000, 19000, 3000, 5000, 2000, 3000, 15000, 21000, 24500, 28000, 22000, 35000],
                    borderColor: '#10B981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: '#F1F5F9',
                            borderDash: [2, 2]
                        },
                        ticks: {
                            color: '#64748B'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: '#64748B'
                        }
                    }
                }
            }
        });
    }
});
