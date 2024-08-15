import ExercisesList from "@/components/ExercisesList";
import FilterList from "@/components/FilterList";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";

export default function HomePage({ muscleGroups }) {
  const {
    data: exercises = [],
    error: errorExercises,
    isLoading: exerciseIsLoading,
  } = useSWR("/api/exercises");

  const [filterMode, setFilterMode] = useState(false);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [muscles, setMuscles] = useState(muscleGroups);
  const [filterApplied, setFilterApplied] = useState(false);

  useEffect(() => {
    if (!exerciseIsLoading && exercises.length > 0) {
      setFilteredExercises(exercises);
    }
  }, [exercises, exerciseIsLoading]);

  if (exerciseIsLoading) {
    return <p>Loading...</p>;
  }

  function handleShowFilter() {
    if (!filterApplied) {
      setFilterApplied(true);
    }
    setFilterMode(!filterMode);
  }

  function handleSelect(muscleGroup) {
    if (!selectedMuscleGroups.includes(muscleGroup)) {
      const newSelectedMuscleGroups = [...selectedMuscleGroups, muscleGroup];
      setSelectedMuscleGroups(newSelectedMuscleGroups);

      setFilteredExercises(
        filteredExercises.filter((filteredExercise) =>
          newSelectedMuscleGroups.every((selectedMuscleGroup) =>
            filteredExercise.muscleGroups.includes(selectedMuscleGroup)
          )
        )
      );

      setMuscles(muscles.filter((muscle) => muscle !== muscleGroup));
    }
  }

  function handleDeselect(muscleGroup) {
    const newSelectedMuscleGroups = selectedMuscleGroups.filter(
      (selectedMuscleGroup) => selectedMuscleGroup !== muscleGroup
    );
    setSelectedMuscleGroups(newSelectedMuscleGroups);

    setFilteredExercises(
      exercises.filter((exercise) =>
        newSelectedMuscleGroups.every((selectedMuscleGroup) =>
          exercise.muscleGroups.includes(selectedMuscleGroup)
        )
      )
    );
    const newMuscles = [...muscles, muscleGroup];
    newMuscles.sort((a, b) => a.localeCompare(b));
    setMuscles(newMuscles);
  }

  function handleClear() {
    setSelectedMuscleGroups([]);
    setFilteredExercises(exercises);
    setMuscles(muscleGroups);
  }

  return (
    <StyledSection>
      <HeadlineSection>
        <H1>
          WELCOME TO YOUR <br />
          EXERCISE LIST
        </H1>
      </HeadlineSection>
      <FilterButton type="button" onClick={handleShowFilter}>
        Filter ☰
      </FilterButton>
      {filterMode ? (
        <FilterList
          muscleGroups={muscles}
          onSelect={handleSelect}
          selectedMuscleGroups={selectedMuscleGroups}
          onDeselect={handleDeselect}
          onClear={handleClear}
        />
      ) : null}
      <ExercisesList
        exercises={filterApplied ? filteredExercises : exercises}
        exerciseIsLoading={exerciseIsLoading}
      />
    </StyledSection>
  );
}

const StyledSection = styled.section`
  display: flex;
  flex-direction: column;
`;

const FilterButton = styled.button`
  border: none;
  background-color: orange;
  border-radius: 0.25rem;
  font-weight: bold;
  padding: 0.25rem;
  align-self: flex-end;
  margin-right: 3.5rem;
  cursor: pointer;
`;

const H1 = styled.h1`
  color: var(--dark-brown);
  font-size: xx-large;
  font-weight: normal;
  line-height: 1;
`;

const HeadlineSection = styled.section`
  width: 85vw;
  max-width: 1000px;
  margin: auto;
`;
