<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommentController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $blogId = $request->input('blog_id');

        $comments = Comment::when($search, function ($query, $search) {
            $query->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('message', 'like', "%{$search}%");
        })
            ->when($blogId, function ($query, $blogId) {
                $query->where('blog_id', $blogId);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Manage/Comments', [
            'comments' => $comments,
            'filters' => [
                'search' => $search,
                'blog_id' => $blogId,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'blog_id' => 'required|exists:blogs,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        Comment::create($data);

        return redirect()->back();
    }

    public function update(Request $request, Comment $comment)
    {
        $data = $request->validate([
            'blog_id' => 'required|exists:blogs,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        $comment->update($data);

        return redirect()->back();
    }

    public function destroy(Comment $comment)
    {
        $comment->delete();
        return redirect()->back();
    }
    
    // Method to get comments for a specific blog
    public function getByBlog(Blog $blog)
    {
        $comments = $blog->comments()->latest()->get();
        
        return response()->json([
            'comments' => $comments
        ]);
    }
}
