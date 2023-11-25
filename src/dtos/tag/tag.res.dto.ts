class TagResponseDto {
  id: number;
  name: string;

  static of(tag: TagResponseDto): TagResponseDto {
    const { id, name } = tag;

    return { id, name };
  }
}

export { TagResponseDto };
