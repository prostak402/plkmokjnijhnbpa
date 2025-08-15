'use client';

import { useState } from 'react';

interface ClipForm {
  kinopoisk_id: string;
  urls: string;
  title: string;
  description: string;
  type: string;
  genres: string;
  year: string;
  ratings: string;
  poster: string;
  date: string;
}

const initialForm: ClipForm = {
  kinopoisk_id: '',
  urls: '',
  title: '',
  description: '',
  type: '',
  genres: '',
  year: '',
  ratings: '',
  poster: '',
  date: '',
};

export default function Upload() {
  const [form, setForm] = useState<ClipForm>(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const loadFromKinopoisk = async () => {
    if (!form.kinopoisk_id) return;
    const res = await fetch(`/api/kinopoisk?id=${form.kinopoisk_id}`);
    if (res.ok) {
      const data = await res.json();
      setForm((prev) => ({ ...prev, ...data }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit clip', form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <h1>Upload Clip</h1>
      <input name="kinopoisk_id" placeholder="Kinopoisk ID" value={form.kinopoisk_id} onChange={handleChange} />
      <button type="button" onClick={loadFromKinopoisk}>Load from Kinopoisk</button>
      <input name="urls" placeholder="URLs" value={form.urls} onChange={handleChange} />
      <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
      <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
      <input name="type" placeholder="Type" value={form.type} onChange={handleChange} />
      <input name="genres" placeholder="Genres" value={form.genres} onChange={handleChange} />
      <input name="year" placeholder="Year" value={form.year} onChange={handleChange} />
      <input name="ratings" placeholder="Ratings" value={form.ratings} onChange={handleChange} />
      <input name="poster" placeholder="Poster URL" value={form.poster} onChange={handleChange} />
      <input name="date" placeholder="Date" value={form.date} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}
