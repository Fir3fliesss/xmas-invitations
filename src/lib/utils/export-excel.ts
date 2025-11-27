import * as XLSX from 'xlsx';
import type { Attendee } from '$lib/supabase';

export interface ExportOptions {
  filename?: string;
  sheetName?: string;
}

export function exportToExcel(
  data: Attendee[],
  options: ExportOptions = {}
): void {
  const {
    filename = `rsvp-natal-${new Date().toISOString().split('T')[0]}`,
    sheetName = 'Data RSVP'
  } = options;

  // Transform data for export
  const exportData = data.map((attendee, index) => ({
    'No': index + 1,
    'Nama': attendee.name,
    'Sekolah': attendee.school === 'other' 
      ? attendee.school_other || 'Lainnya'
      : getSchoolLabel(attendee.school),
    'Kelas': attendee.class === 'Lainnya'
      ? attendee.class_other || 'Lainnya'
      : attendee.class,
    'Status': attendee.is_attending ? 'Hadir' : 'Tidak Hadir',
    'Alasan': attendee.reason || '-',
    'Tanggal Daftar': formatDateTime(attendee.created_at),
    'Terakhir Update': formatDateTime(attendee.updated_at)
  }));

  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 5 },   // No
    { wch: 25 },  // Nama
    { wch: 35 },  // Sekolah
    { wch: 15 },  // Kelas
    { wch: 12 },  // Status
    { wch: 30 },  // Alasan
    { wch: 20 },  // Tanggal Daftar
    { wch: 20 },  // Terakhir Update
  ];

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Add summary sheet
  const summaryData = [
    { 'Statistik': 'Total RSVP', 'Jumlah': data.length },
    { 'Statistik': 'Hadir', 'Jumlah': data.filter(a => a.is_attending).length },
    { 'Statistik': 'Tidak Hadir', 'Jumlah': data.filter(a => !a.is_attending).length },
    { 'Statistik': '', 'Jumlah': '' },
    { 'Statistik': 'Exported At', 'Jumlah': formatDateTime(new Date().toISOString()) }
  ];
  
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  summarySheet['!cols'] = [{ wch: 15 }, { wch: 25 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan');

  // Download file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

function getSchoolLabel(school: string): string {
  const schools: Record<string, string> = {
    'penus': 'SMK Plus Pelita Nusantara (Penus)',
    'pesat': 'SMA Plus PGRI Cibinong (Pesat)',
    'other': 'Lainnya'
  };
  return schools[school] || school;
}

function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
