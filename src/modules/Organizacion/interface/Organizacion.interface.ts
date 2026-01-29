export interface ICrearOrganizacionDTO {
  nombre_organizacion: string;
  razon_social_organizacion?: string;

  estatus_organizacion: boolean;

  rfc_organizacion?: string;
  regimen_fisca_organizacion?: string;
  uso_cfdi_default_organizacion?: string;
  codigo_postal_fiscal_organizacion?: string;

  email_contacto_organizacion?: string;
  telefono_contacto_organizacion?: string;
  direccion_organizacion?: string;

  logo_url?: string;
  moneda_organizacion: string;
}
