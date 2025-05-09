<?php

use App\Http\Controllers\BlogController;
use App\Http\Controllers\ProfileController;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/admin', function () {
    return 'Halaman Admin';
})->middleware('role:admin');  // Parameter "admin" diberikan

Route::prefix('manage')->group(function () {
    Route::get('/blog', function (Request $request) {
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
        // return Inertia::render('Manage/Blog');
    })->name('blog');
    Route::get('/portfolio', function () {
        return Inertia::render('Manage/Portfolio');
    })->name('portfolio');
    Route::get('/comment', function () {
        return Inertia::render('Manage/Comment');
    })->name('comment');
    Route::get('/user', function () {
        return Inertia::render('Manage/User');
    })->name('user');
    Route::get('/pengadaan', function () {
        return Inertia::render('Manage/Pengadaan');
    })->name('pengadaan');
});

Route::resource('blogs', BlogController::class);

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/', function () {
     // Data statis sebagai contoh user login palsu
    return Inertia::render('Dashboard');
    // return redirect()->route('blog');
})->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
