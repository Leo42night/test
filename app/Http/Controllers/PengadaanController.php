<?php

namespace App\Http\Controllers;

use App\Models\Pengadaan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PengadaanController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search');
        $type = $request->input('type');

        $pengadaans = Pengadaan::when($search, function ($query, $search) {
            $query->where('job', 'like', "%{$search}%")
                  ->orWhere('date', 'like', "%{$search}%");
        })
        ->when($type, function ($query, $type) {
            $query->where('type', $type);
        })
        ->latest()
        ->paginate(10)
        ->withQueryString();

        return Inertia::render('Manage/Pengadaan', [
            'pengadaans' => $pengadaans,
            'filters' => [
                'search' => $search,
                'type' => $type,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'job' => 'required|string|max:255',
            'type' => 'required|string|in:Full Time,Part Time',
            'date' => 'required|date',
            'form' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        if ($request->hasFile('form')) {
            $data['form'] = $request->file('form')->store('pengadaan', 'public');
        } else {
            // Default form if no file is uploaded
            $data['form'] = 'pengadaan/form_default.pdf';
        }

        Pengadaan::create($data);

        return redirect()->back();
    }

    public function update(Request $request, Pengadaan $pengadaan)
    {
        $data = $request->validate([
            'job' => 'required|string|max:255',
            'type' => 'required|string|in:Full Time,Part Time',
            'date' => 'required|date',
            'form' => 'nullable|file|mimes:pdf|max:5120',
        ]);

        if ($request->hasFile('form')) {
            // Delete old file if it's not the default form
            if ($pengadaan->form !== 'pengadaan/form_default.pdf') {
                Storage::disk('public')->delete($pengadaan->form);
            }
            $data['form'] = $request->file('form')->store('pengadaan', 'public');
        } else {
            $data['form'] = $pengadaan->form;
        }

        $pengadaan->update($data);

        return redirect()->back();
    }

    public function destroy(Pengadaan $pengadaan)
    {
        // Delete the form file if it's not the default form
        if ($pengadaan->form !== 'pengadaan/form_default.pdf') {
            Storage::disk('public')->delete($pengadaan->form);
        }
        
        $pengadaan->delete();
        
        return redirect()->back();
    }
    
    public function downloadForm(Pengadaan $pengadaan)
    {
        if (!Storage::disk('public')->exists($pengadaan->form)) {
            abort(404, 'Form not found');
        }
        
        return Storage::disk('public')->download($pengadaan->form, 'Form Pengadaan - ' . $pengadaan->job . '.pdf');
    }
}
