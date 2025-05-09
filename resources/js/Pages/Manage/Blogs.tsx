// import TrixEditor from '@/Components/TrixEditor';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useForm, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { TrixEditor } from "react-trix";
import 'trix/dist/trix.css';
import "trix";

type Props = {
  blogs: {
    data: any[],
    links: any[],
  },
  filters: {
    search: string,
  }
}

type Blog = {
  id: number;
  title: string;
  description: string;
  cover?: string;
};

export default function Blogs({ blogs, filters }: Props) {
  const [search, setSearch] = useState(filters.search || '');
  const [showModal, setShowModal] = useState(false);
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState({
    submit: false,
    delete: null as number | null
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(route('blogs.index'), { search });
  };

  const resetSearch = () => {
    setSearch('');
    router.get(route('blogs.index'), { search: '' });
  };

  const { data, setData, post, put, delete: destroy, reset } = useForm<{
    title: string;
    description: string;
    cover: File | null;
  }>({
    title: '',
    description: '',
    cover: null
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, submit: true })); // Before request
    if (editBlog) {
      put(route('blogs.update', editBlog.id), {
        onSuccess: () => {
          closeModal();
          setLoading(prev => ({ ...prev, submit: false }));
        },
        onError: () => {
          setLoading(prev => ({ ...prev, submit: false }));
        }
      });
    } else {
      post(route('blogs.store'), {
        onSuccess: () => {
          closeModal();
          setLoading(prev => ({ ...prev, submit: false }));
        },
        onError: () => {
          setLoading(prev => ({ ...prev, submit: false }));
        }
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditBlog(null);
    reset();
  };

  const handleEdit = (blog: any) => {
    setEditBlog(blog);
    setData({
      title: blog.title,
      description: blog.description,
      cover: null
    });
    setShowModal(true);
    console.log(blog);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure?')) {
      setLoading(prev => ({ ...prev, submit: true }));
      destroy(route('blogs.destroy', id), {
        onSuccess: () => {
          setLoading(prev => ({ ...prev, delete: null }));
        },
        onError: () => {
          setLoading(prev => ({ ...prev, delete: null }));
        }
      });
    }
  };

  const handleChange = (html: string, _: string) => {
    console.log("Text:", html);
    setData('description', html);
  };

  const handleEditorReady = () => {
    console.log('Editor is ready');
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Kelola Blog
        </h2>
      }
    >
      <Head title="Blog" />
      <div className="p-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between item-start md:items-center gap-4 md:gap-0 mb-4">
          <div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded w-full md:w-auto" onClick={() => setShowModal(true)}>
              Tambah Blog
            </button>
          </div>

          <div className="w-full md:w-auto">
            <form onSubmit={handleSearch} className="flex flex-row gap-2">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder="Cari blog..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1016.65 16.65z" />
                </svg>
              </div>

              <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
                Cari
              </button>
              <button type="button" onClick={resetSearch} className="bg-gray-300 text-gray-700 px-3 py-1 rounded">
                Reset
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {blogs.data.map((blog: any) => (
            <div
              key={blog.id}
              // className="flex flex-col border rounded-2xl shadow-sm overflow-hidden h-[420px] bg-white"
              className="flex flex-col border rounded-2xl shadow-sm overflow-hidden h-96 bg-white"
            >
              <img
                src={`/storage/${blog.cover ?? 'blogs/default.png'}`}
                alt={blog.title}
                className="h-40 w-full object-cover"
              />
              <div className="flex flex-col flex-1 p-4">
                <h2 className="text-2xl font-semibold line-clamp-2 leading-snug mb-1">
                  {blog.title}
                </h2>
                <div className="text-gray-600 line-clamp-3 mb-4 flex-grow text-xs" dangerouslySetInnerHTML={{ __html: blog.description }} />
                {/* {blog.description} */}
                {/* <p className="text-base text-gray-600 line-clamp-3 mb-4 flex-grow">
                </p> */}
                <div className="mt-auto flex gap-4 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="text-red-600 flex items-center hover:underline"
                    disabled={loading.delete === blog.id}
                  >
                    {loading.delete === blog.id ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Menghapus...
                      </>
                    ) : 'Hapus'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>


        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
            <div className="bg-white p-4 md:p-6 rounded w-full max-w-3xl md:w-2/3 mx-4 md:mx-auto max-h-screen overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">{editBlog ? 'Edit' : 'Tambah'} Blog</h2>
              <form onSubmit={submit} className="space-y-4 md:p-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
                  <input
                    type="text"
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                    placeholder="Judul"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                  <TrixEditor onChange={handleChange} onEditorReady={handleEditorReady} value={data.description} mergeTags={[]}/>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{editBlog && 'Ubah'} Gambar</label>
                  <input
                    type="file"
                    onChange={e => setData('cover', e.target.files?.[0] ?? null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                      file:rounded file:border-0
                      file:text-sm file:font-semibold
                      file:bg-green-50 file:text-green-700
                      hover:file:bg-green-100"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-1 rounded flex items-center"
                    disabled={loading.submit}
                  >
                    {loading.submit ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {editBlog ? 'Memperbarui...' : 'Menyimpan...'}
                      </>
                    ) : (
                      editBlog ? 'Update' : 'Simpan'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center mt-6 space-x-2">
          {blogs.links.map((link, idx) => (
            <button
              key={idx}
              onClick={() => link.url && router.visit(link.url)}
              dangerouslySetInnerHTML={{ __html: link.label }}
              disabled={!link.url}
              className={`px-3 py-1 border rounded ${link.active ? 'bg-blue-500 text-white' :
                !link.url ? 'bg-white text-gray-300 cursor-not-allowed' : 'bg-white text-gray-700'
                }`}
            />
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  )
}