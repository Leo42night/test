// name, image, description, category [], client

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';



export default function Portfolio() {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Portfolio
        </h2>
      }
    >
      <Head title="Portfolio" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <h1>Portfolio</h1>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}