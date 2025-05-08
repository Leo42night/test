<?php

namespace App\Http\Controllers;

use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PortfolioController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $category = $request->input('category');
        $client = $request->input('client');

        $portfolios = Portfolio::when($search, function ($query, $search) {
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        })
        ->when($category, function ($query, $category) {
            $query->where('category', $category);
        })
        ->when($client, function ($query, $client) {
            $query->where('client', $client);
        })
        ->latest()
        ->paginate(9)
        ->withQueryString();

        // Get unique categories and clients for filters
        $categories = Portfolio::distinct()->pluck('category');
        $clients = Portfolio::distinct()->pluck('client');

        return Inertia::render('Manage/Portfolios', [
            'portfolios' => $portfolios,
            'categories' => $categories,
            'clients' => $clients,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'client' => $client,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'client' => 'required|string|max:255',
            'image' => 'required|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('portfolios', 'public');
        }

        Portfolio::create($data);

        return redirect()->back();
    }

    public function update(Request $request, Portfolio $portfolio)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'client' => 'required|string|max:255',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image
            Storage::disk('public')->delete($portfolio->image);
            $data['image'] = $request->file('image')->store('portfolios', 'public');
        } else {
            $data['image'] = $portfolio->image;
        }

        $portfolio->update($data);

        return redirect()->back();
    }

    public function destroy(Portfolio $portfolio)
    {
        // Delete the image file
        Storage::disk('public')->delete($portfolio->image);
        
        $portfolio->delete();
        
        return redirect()->back();
    }
    
    public function getByCategory($category)
    {
        $portfolios = Portfolio::where('category', $category)
            ->latest()
            ->get();
            
        return response()->json([
            'portfolios' => $portfolios
        ]);
    }

    public function getByClient($client)
    {
        $portfolios = Portfolio::where('client', $client)
            ->latest()
            ->get();
            
        return response()->json([
            'portfolios' => $portfolios
        ]);
    }
}
