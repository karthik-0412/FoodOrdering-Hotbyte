package com.hexaware.serviceimplementation;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import com.hexaware.dto.MenuCategoryDTO;
import com.hexaware.entity.MenuCategory;
import com.hexaware.exceptions.ResourceNotFoundException;
import com.hexaware.mapper.MenuCategoryMapper;
import com.hexaware.repository.MenuCategoryRepository;
import com.hexaware.repository.MenuRepository;
import com.hexaware.serviceImplementation.MenuCategoryServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

class MenuCategoryServiceImplTest {

    @InjectMocks
    private MenuCategoryServiceImpl service;

    @Mock
    private MenuCategoryRepository categoryRepository;

    @Mock
    private MenuRepository menuRepository;

    @Mock
    private MenuCategoryMapper categoryMapper;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    //  Test addMenuCategory
    @Test
    void testAddMenuCategory() {
        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setCategoryName("Veg");
        dto.setDescription("Vegetarian Food");

        MenuCategory entity = new MenuCategory();
        entity.setCategoryName("Veg");
        entity.setDescription("Vegetarian Food");

        MenuCategory saved = new MenuCategory();
        saved.setCategoryName("Veg");
        saved.setDescription("Vegetarian Food");
        saved.setStatus("Active");
        saved.setCreatedAt(LocalDate.now());

        when(categoryMapper.dtoToEntity(dto)).thenReturn(entity);
        when(categoryRepository.save(any())).thenReturn(saved);
        when(categoryMapper.entityToDto(saved)).thenReturn(dto);

        MenuCategoryDTO result = service.addMenuCategory(dto);

        assertNotNull(result);
        assertEquals("Veg", result.getCategoryName());
    }

    //  Test getAllMenuCategories
    @Test
    void testGetAllMenuCategories() {
        MenuCategory category = new MenuCategory();
        category.setCategoryName("Dessert");

        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setCategoryName("Dessert");

        when(categoryRepository.findAll()).thenReturn(Collections.singletonList(category));
        when(categoryMapper.entityToDto(category)).thenReturn(dto);

        List<MenuCategoryDTO> result = service.getAllMenuCategories();

        assertEquals(1, result.size());
        assertEquals("Dessert", result.get(0).getCategoryName());
    }

    //  Test getAllCategoriesWithItemCounts
    @Test
    void testGetAllCategoriesWithItemCounts() {
        MenuCategory cat = new MenuCategory();
        cat.setCategoryName("Main Course");

        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setCategoryName("Main Course");

        when(categoryRepository.findAll()).thenReturn(Collections.singletonList(cat));
        when(menuRepository.countByCategory(cat)).thenReturn(5);
        when(categoryMapper.entityToDto(cat)).thenReturn(dto);

        List<MenuCategoryDTO> result = service.getAllCategoriesWithItemCounts();

        assertEquals(1, result.size());
        assertEquals(5, result.get(0).getItemCount());
    }

    // Test updateMenuCategory
    @Test
    void testUpdateMenuCategory() {
        int id = 1;
        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setCategoryName("Updated");
        dto.setDescription("Updated Desc");

        MenuCategory existing = new MenuCategory();
        existing.setCategoryName("Old");
        existing.setDescription("Old Desc");

        MenuCategory updated = new MenuCategory();
        updated.setCategoryName("Updated");
        updated.setDescription("Updated Desc");

        when(categoryRepository.findById(id)).thenReturn(Optional.of(existing));
        when(categoryRepository.save(existing)).thenReturn(updated);
        when(categoryMapper.entityToDto(updated)).thenReturn(dto);

        MenuCategoryDTO result = service.updateMenuCategory(id, dto);

        assertEquals("Updated", result.getCategoryName());
        assertEquals("Updated Desc", result.getDescription());
    }

    //  Test deleteMenuCategory - Success
    @Test
    void testDeleteMenuCategorySuccess() {
        int id = 10;
        when(categoryRepository.existsById(id)).thenReturn(true);
        doNothing().when(categoryRepository).deleteById(id);

        assertDoesNotThrow(() -> service.deleteMenuCategory(id));
        verify(categoryRepository).deleteById(id);
    }

    // ✅ Test deleteMenuCategory - Not Found
    @Test
    void testDeleteMenuCategoryFailure() {
        int id = 11;
        when(categoryRepository.existsById(id)).thenReturn(false);

        Exception ex = assertThrows(RuntimeException.class, () -> service.deleteMenuCategory(id));
        assertTrue(ex.getMessage().contains("Category not found"));
    }

    //  Test changeStatus - Success
    @Test
    void testChangeStatusSuccess() {
        int id = 5;
        MenuCategory category = new MenuCategory();
        category.setStatus("Active");

        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setStatus("Inactive");

        when(categoryRepository.findById(id)).thenReturn(Optional.of(category));
        when(categoryRepository.save(category)).thenReturn(category);
        when(categoryMapper.entityToDto(category)).thenReturn(dto);

        MenuCategoryDTO result = service.changeStatus(id, "Inactive");

        assertEquals("Inactive", result.getStatus());
    }

    // Test changeStatus - Not Found
    @Test
    void testChangeStatusNotFound() {
        int id = 99;
        when(categoryRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> service.changeStatus(id, "Active"));
    }
}