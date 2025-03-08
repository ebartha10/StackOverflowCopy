package com.utcn.demo.service;

import com.utcn.demo.dto.TagDTO;
import com.utcn.demo.entity.Tag;
import com.utcn.demo.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TagService {
    public static final int SEARCH_RESULT_PER_PAGE = 10;

    @Autowired
    private TagRepository tagRepository;

    public TagDTO createTag(TagDTO tagDTO) {
        Tag tag = new Tag();
        tag.setName(tagDTO.getName());

        Tag createdTag = tagRepository.save(tag);
        return new TagDTO(createdTag.getId(), createdTag.getName());
    }

    public TagDTO getTagById(String id) {
        Optional<Tag> tag = tagRepository.findById(id);
        if (tag.isPresent()) {
            Tag t = tag.get();
            return new TagDTO(t.getId(), t.getName());
        }
        return null;
    }

    public List<TagDTO> searchTags(String tagName, int pageNumber) {
        Pageable paging = PageRequest.of(pageNumber, SEARCH_RESULT_PER_PAGE);
        Page<Tag> tagsPage = tagRepository.findAllByNameContainingIgnoreCase(tagName, paging);
        
        return tagsPage.getContent().stream()
            .map(tag -> new TagDTO(tag.getId(), tag.getName()))
            .collect(Collectors.toList());
    }
    public List<TagDTO> getAllTags(int pageNumber) {
        Pageable paging = PageRequest.of(pageNumber, SEARCH_RESULT_PER_PAGE);
        Page<Tag> tagsPage = tagRepository.findAll(paging);

        return tagsPage.getContent().stream()
            .map(tag -> new TagDTO(tag.getId(), tag.getName()))
            .collect(Collectors.toList());
    }
    public TagDTO updateTag(TagDTO tagDTO) {
        Optional<Tag> optionalTag = tagRepository.findById(tagDTO.getId());
        if (optionalTag.isPresent()) {
            Tag tag = optionalTag.get();
            tag.setName(tagDTO.getName());

            Tag updatedTag = tagRepository.save(tag);
            return new TagDTO(updatedTag.getId(), updatedTag.getName());
        }
        return null;
    }

    public String deleteTag(String id) {
        try {
            tagRepository.deleteById(id);
            return "Tag successfully deleted!";
        } catch (Exception e) {
            return null;
        }
    }
} 