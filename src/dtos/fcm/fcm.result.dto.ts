class FcmResultDto {
  multicast_id: number;
  success: number;
  failure: number;
  canonical_ids: number;
  results: { [key: string]: string }[];
}

export { FcmResultDto };
