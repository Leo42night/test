<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class cleanStorage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'storage:clean-setup';
    
    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Hapus semua file di storage/app/public kecuali blogs/1.jpg dan blogs/2.jpg';


    /**
     * Execute the console command.
     */
    public function handle()
    {
        $basePath = storage_path('app/public');

        $exceptions = array_filter(array_map(function($i) use ($basePath) {
            return realpath($basePath ."/blogs/{$i}.jpg");
        }, range(1,10)));

        // $exceptions[] = realpath($basePath ."/blogs/1.jpg");
        // $exceptions[] = realpath($basePath ."/blogs/2.jpg");

        $this->info("Membersihkan isi storage/app/public...");

        $files = File::allFiles($basePath);

        foreach ($files as $file) {
            $realPath = $file->getRealPath();
            if (!in_array($realPath, $exceptions)) {
                File::delete($realPath);
                $this->line("Deleted: {$file->getRelativePathname()}");
            } else {
                $this->line("Skipped: {$file->getRelativePathname()}");
            }
        }

        $this->info("Selesai.");
        return 0;
    }
}
