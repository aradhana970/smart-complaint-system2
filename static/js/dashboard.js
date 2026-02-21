/**
 * Smart Complaint & Service Tracking System
 * Dashboard JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    initDashboard();
    initComplaintTable();
});

/**
 * Initialize dashboard features
 */
function initDashboard() {
    // Auto-refresh dashboard every 30 seconds (for admin)
    if (document.body.classList.contains('admin-dashboard')) {
        setInterval(refreshDashboardStats, 30000);
    }
    
    // Initialize any dashboard-specific features
    initQuickActions();
}

/**
 * Refresh dashboard statistics
 */
async function refreshDashboardStats() {
    try {
        const response = await fetch('/api/stats');
        const data = await response.json();
        
        // Update stat cards
        updateStatCard('total', data.total);
        updateStatCard('pending', data.pending);
        updateStatCard('in_progress', data.in_progress);
        updateStatCard('resolved', data.resolved);
        updateStatCard('urgent', data.urgent);
        updateStatCard('high', data.high);
    } catch (error) {
        console.error('Error refreshing stats:', error);
    }
}

/**
 * Update individual stat card
 */
function updateStatCard(type, value) {
    const element = document.querySelector(`.stat-${type} .stat-content h3`);
    if (element) {
        element.textContent = value;
        
        // Add animation
        element.classList.add('pulse');
        setTimeout(() => element.classList.remove('pulse'), 500);
    }
}

/**
 * Initialize quick action buttons
 */
function initQuickActions() {
    const quickActions = document.querySelectorAll('.quick-action-btn');
    quickActions.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            const action = this.dataset.action;
            const id = this.dataset.id;
            
            if (action === 'copy-tracking') {
                e.preventDefault();
                const trackingId = this.dataset.trackingId;
                copyToClipboard(trackingId);
                showToast('Tracking ID copied to clipboard!', 'success');
            }
        });
    });
}

/**
 * Initialize complaint table features
 */
function initComplaintTable() {
    const table = document.getElementById('complaintsTable') || document.getElementById('adminComplaintsTable');
    if (!table) return;
    
    // Add row click handler
    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(function(row) {
        row.style.cursor = 'pointer';
        row.addEventListener('click', function(e) {
            // Don't trigger if clicking on a button
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') return;
            
            const viewBtn = row.querySelector('a.btn');
            if (viewBtn) {
                window.location.href = viewBtn.href;
            }
        });
    });
    
    // Add hover effect
    rows.forEach(function(row) {
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8fafc';
        });
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
}

/**
 * Filter complaints
 */
function filterComplaints(status, priority, category) {
    const url = new URL(window.location.href);
    
    if (status) {
        url.searchParams.set('status', status);
    } else {
        url.searchParams.delete('status');
    }
    
    if (priority) {
        url.searchParams.set('priority', priority);
    } else {
        url.searchParams.delete('priority');
    }
    
    if (category) {
        url.searchParams.set('category', category);
    } else {
        url.searchParams.delete('category');
    }
    
    window.location.href = url.toString();
}

/**
 * Export complaints to CSV
 */
function exportToCSV() {
    const table = document.getElementById('adminComplaintsTable');
    if (!table) return;
    
    let csv = [];
    const rows = table.querySelectorAll('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const row = [], cols = rows[i].querySelectorAll('td, th');
        
        for (let j = 0; j < cols.length; j++) {
            // Escape quotes and wrap in quotes
            let data = cols[j].innerText.replace(/"/g, '""');
            row.push('"' + data + '"');
        }
        
        csv.push(row.join(','));
    }
    
    const csvFile = new Blob([csv.join('\n')], {type: "text/csv"});
    const downloadLink = document.createElement("a");
    downloadLink.download = "complaints.csv";
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

/**
 * Print complaint details
 */
function printComplaint() {
    window.print();
}

/**
 * Refresh complaint list
 */
function refreshComplaintList() {
    const url = new URL(window.location.href);
    window.location.href = url.toString();
}

// Add pulse animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    .pulse {
        animation: pulse 0.5s ease-in-out;
    }
`;
document.head.appendChild(style);
