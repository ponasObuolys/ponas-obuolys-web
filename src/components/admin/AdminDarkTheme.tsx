import React from 'react';

const AdminDarkTheme = () => {
  return (
    <style>
      {`
        .dark .admin-panel {
          @apply bg-gradient-to-br from-gray-900 to-gray-800;
        }

        .dark .admin-card {
          @apply bg-gray-800/50 border-gray-700;
        }

        .dark .admin-input {
          @apply bg-gray-800/50 text-white border-gray-700;
        }

        .dark .admin-button:not(.btn-primary) {
          @apply bg-gray-700 hover:bg-gray-600;
        }

        .dark .admin-table {
          @apply bg-gray-900/50 rounded-lg overflow-hidden;
        }

        .dark .admin-table th {
          @apply bg-gray-900/80 text-gray-300 font-medium border-b border-gray-700;
        }

        .dark .admin-table td {
          @apply text-gray-300 border-gray-700/50;
        }

        .dark .admin-table tr:hover {
          @apply bg-gray-800/50;
        }

        .dark .admin-search {
          @apply bg-gray-800/50 text-white border-gray-700;
        }

        .dark .admin-dropdown {
          @apply bg-gray-800 text-white border-gray-700;
        }

        .dark .stats-card {
          @apply bg-gray-800/50 border-gray-700;
        }

        .dark .admin-panel .bg-white {
          @apply bg-gray-800/50;
        }

        .dark .admin-panel .text-gray-700 {
          @apply text-gray-300;
        }

        .dark .admin-panel .border-gray-200 {
          @apply border-gray-700;
        }

        .dark .admin-panel [role="combobox"] {
          @apply bg-gray-800/50 border-gray-700 text-gray-300;
        }

        .dark .admin-panel [role="listbox"] {
          @apply bg-gray-800 border-gray-700;
        }

        .dark .admin-panel [role="option"] {
          @apply text-gray-300 hover:bg-gray-700;
        }

        @media (max-width: 768px) {
          .dark .admin-panel {
            @apply px-4;
          }
          
          .dark .stats-card {
            @apply mx-2;
          }
        }
      `}
    </style>
  );
};

export default AdminDarkTheme;