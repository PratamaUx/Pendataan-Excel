from flask import Blueprint, request, jsonify, send_file
from flask_cors import cross_origin
import pandas as pd
import io
from datetime import datetime

excel_bp = Blueprint('excel', __name__)

@excel_bp.route('/export-excel', methods=['POST'])
@cross_origin()
def export_excel():
    try:
        # Ambil data dari request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Prepare data for Excel
        excel_data = []
        for index, item in enumerate(data):
            # Format datetime
            jam_reservasi = item.get('jamReservasi', '')
            if jam_reservasi:
                try:
                    dt = datetime.fromisoformat(jam_reservasi.replace('Z', '+00:00'))
                    jam_reservasi_formatted = dt.strftime('%d %b %Y %H:%M')
                except:
                    jam_reservasi_formatted = jam_reservasi
            else:
                jam_reservasi_formatted = ''
            
            # Format created date
            created_at = item.get('createdAt', '')
            if created_at:
                try:
                    dt = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                    created_at_formatted = dt.strftime('%d %b %Y %H:%M')
                except:
                    created_at_formatted = created_at
            else:
                created_at_formatted = ''
            
            # Format phone number
            no_hp = item.get('noHp', '')
            formatted_phone = format_phone_number(no_hp)
            
            # Generate WhatsApp link
            whatsapp_link = generate_whatsapp_link(no_hp)
            
            excel_data.append({
                'No.': index + 1,
                'Kategori': item.get('kategori', ''),
                'Klien/Sumber': item.get('klien', ''),
                'PIC Klien': item.get('pic', ''),
                'Jumlah': item.get('jumlah', 0),
                'No. HP': formatted_phone,
                'WhatsApp': whatsapp_link,
                'Daerah Asal': item.get('daerah', ''),
                'Status': item.get('status', ''),
                'Jam Reservasi': jam_reservasi_formatted,
                'Show': 'Ya' if item.get('show', False) else 'Tidak',
                'Dibuat': created_at_formatted,
                'Diperbarui': item.get('updatedAt', '')
            })
        
        # Create DataFrame
        df = pd.DataFrame(excel_data)
        
        # Create Excel file in memory
        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='openpyxl') as writer:
            df.to_excel(writer, sheet_name='Data Pendaftaran JCS', index=False)
            
            # Get the workbook and worksheet
            workbook = writer.book
            worksheet = writer.sheets['Data Pendaftaran JCS']
            
            # Auto-adjust column widths
            for column in worksheet.columns:
                max_length = 0
                column_letter = column[0].column_letter
                for cell in column:
                    try:
                        if len(str(cell.value)) > max_length:
                            max_length = len(str(cell.value))
                    except:
                        pass
                adjusted_width = min(max_length + 2, 50)
                worksheet.column_dimensions[column_letter].width = adjusted_width
            
            # Style the header row
            from openpyxl.styles import Font, PatternFill, Alignment
            header_font = Font(bold=True, color='FFFFFF')
            header_fill = PatternFill(start_color='366092', end_color='366092', fill_type='solid')
            
            for cell in worksheet[1]:
                cell.font = header_font
                cell.fill = header_fill
                cell.alignment = Alignment(horizontal='center', vertical='center')
        
        output.seek(0)
        
        return send_file(
            output,
            mimetype='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            as_attachment=True,
            download_name='data-pendaftaran-jcs.xlsx'
        )
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def format_phone_number(phone):
    """Format phone number for display"""
    if not phone:
        return ''
    
    cleaned = ''.join(filter(str.isdigit, phone))
    if cleaned.startswith('62'):
        return '+' + cleaned
    elif cleaned.startswith('0'):
        if len(cleaned) >= 10:
            return f"{cleaned[:4]}-{cleaned[4:8]}-{cleaned[8:]}"
        return cleaned
    return phone

def generate_whatsapp_link(phone):
    """Generate WhatsApp link"""
    if not phone:
        return ''
    
    cleaned = ''.join(filter(str.isdigit, phone))
    if cleaned.startswith('0'):
        cleaned = '62' + cleaned[1:]
    elif not cleaned.startswith('62'):
        cleaned = '62' + cleaned
    
    message = 'Halo, saya ingin menanyakan tentang reservasi JCS.'
    return f"https://wa.me/{cleaned}?text={message}"

