'use client';

import { Product } from '@/app/lib/definitions';

interface SIMCardDetailProps {
  product: Product;
  simStatus?: { emoji?: string; name_vi: string };
}

export function SIMCardDetail({ product, simStatus }: SIMCardDetailProps) {
  return (
    <div className="space-y-6">
      {/* Detailed Information Table */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 text-lg font-semibold text-gray-900">Chi tiết thông tin</h4>
        
        <div className="space-y-4">
          <DetailRow label="MSN / IMSI" value={product.msn || product.imsi || 'N/A'} />
          <DetailRow label="Nhà mạng" value={product.carrier || 'N/A'} />
          {product.imei && <DetailRow label="IMEI" value={product.imei} />}
          {product.iccid && <DetailRow label="ICCID" value={product.iccid} />}
          <DetailRow label="Loại thiết bị" value={product.device_type || 'SIM Free'} />
          <DetailRow label="Loại SIM" value={product.sim_type || 'N/A'} />
          <DetailRow label="Dung lượng" value={product.capacity || 'N/A'} />
          <DetailRow label="Ngày xuất kho" value={product.shipping_date ? new Date(product.shipping_date).toLocaleDateString('ja-JP') : 'N/A'} />
          <DetailRow label="Ngày hết hạn" value={product.expiration_date ? new Date(product.expiration_date).toLocaleDateString('ja-JP') : 'N/A'} />
          {product.activation_date && <DetailRow label="Ngày kích hoạt" value={new Date(product.activation_date).toLocaleDateString('ja-JP')} />}
          {product.options && <DetailRow label="Tùy chọn" value={product.options} />}
          {simStatus && <DetailRow label="Trạng thái SIM" value={getSIMStatusLabel(simStatus)} />}
        </div>
      </div>

      {/* Pricing Information */}
      

      {/* Description */}
      {product.description && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h4 className="mb-3 text-lg font-semibold text-gray-900">Mô tả</h4>
          <p className="text-gray-700">{product.description}</p>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 px-4 hover:bg-gray-50 rounded">
      <span className="text-sm font-medium text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function getSIMStatusLabel(simStatus: { emoji?: string; name_vi: string } | undefined): string {
  if (!simStatus) return '-';
  return `${simStatus.emoji || ''} ${simStatus.name_vi}`.trim();
}
