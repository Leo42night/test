// nomor, pekerjaan, jenis, tanggal, file pdf
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Pengadaan() {
  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Pengadaan
        </h2>
      }
    >
      <Head title="Pengadaan" />
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <h1>Pengadaan</h1>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}