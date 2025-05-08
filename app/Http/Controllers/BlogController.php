<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');

        $blogs = Blog::when($search, function ($query, $search) {
            $query->where('title', 'like', "%{$search}%")
                ->orWhere('description', 'like', "%{$search}%");
        })
            ->latest()
            ->paginate(6)
            ->withQueryString();

        return Inertia::render('Manage/Blogs', [
            'blogs' => $blogs,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'cover' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('cover')) {
            $data['cover'] = $request->file('cover')->store('blogs', 'public');
        }

        Blog::create($data);

        return redirect()->back();
    }

    public function storeImages(Request $request) {
        // ganti pakai images
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Validasi file gambar
        ]);

        // Simpan file ke storage
        $path = $request->file('image')->store('uploads', 'public');

        // Kembalikan URL gambar agar bisa digunakan oleh Trix
        return response()->json(['imageUrl' => Storage::url($path)]);
    }

    public function update(Request $request, Blog $blog)
    {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'cover' => 'nullable|image|max:2048'
        ]);

        if ($request->hasFile('cover')) {
            Storage::disk('public')->delete($blog->cover);
            $data['cover'] = $request->file('cover')->store('blogs', 'public');
        } else {
            $data['cover'] = $blog->cover;
        }

        $blog->update($data);

        return redirect()->back();
    }

    public function destroy(Blog $blog)
    {
        Storage::disk('public')->delete($blog->cover);
        $blog->delete();
        return redirect()->back();
    }
}
