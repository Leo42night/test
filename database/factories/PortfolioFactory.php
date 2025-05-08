<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Portfolio>
 */
class PortfolioFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->text(),
            'category' => $this->faker->randomElement(['Category 1', 'Category 2', 'Category 3']),
            'client' => $this->faker->company(),
            'image' => 'porfolios/default.png',
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
